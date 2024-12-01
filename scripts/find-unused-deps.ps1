# Create output directory if it doesn't exist
New-Item -ItemType Directory -Force -Path .\dep-analysis

# Get timestamp for unique analysis names
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputFile = ".\dep-analysis\unused-deps_$timestamp.txt"

# Install depcheck locally if not already installed
Write-Host "Installing depcheck locally..."
#pnpm add -D depcheck

# Create the analysis script
$analysisScript = @'
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const depcheck = require('depcheck');

// Change to project root directory (two levels up from analyze-deps.js)
process.chdir(path.resolve(__dirname, '..', '..'));

async function findUnusedDependencies() {
    console.log('Analyzing dependencies...\n');
    
    // Get package.json content using absolute path
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    console.log(`Reading package.json from: ${packageJsonPath}`);
    const packageJson = require(packageJsonPath);
    
    const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    // Run depcheck
    const options = {
        ignorePatterns: [
            'build',
            'dist',
            '.next',
            'node_modules',
            '*.test.*',
            '*.spec.*',
            'scripts',
            'config',
            'public'
        ],
        parsers: {
            '**/*.js': depcheck.parser.es6,
            '**/*.jsx': depcheck.parser.jsx,
            '**/*.ts': depcheck.parser.typescript,
            '**/*.tsx': depcheck.parser.typescript,
            '**/*.mdx': depcheck.parser.typescript
        },
        detectors: [
            depcheck.detector.requireCallExpression,
            depcheck.detector.importDeclaration,
            depcheck.detector.exportDeclaration
        ],
        specials: [
            depcheck.special.eslint,
            depcheck.special.jest,
            depcheck.special.prettier,
            depcheck.special.typescript,
            depcheck.special.nextjs
        ],
        ignoreMatches: [
            'typescript',
            'eslint',
            'eslint-config-next',
            'postcss',
            'autoprefixer',
            'tailwindcss',
            '@types/*',
            'cross-env',
            'prettier',
            'prettier-plugin-tailwindcss',
            'jest',
            'jest-environment-jsdom',
            'ts-jest',
            '@testing-library/*',
            'prisma',
            'ts-node',
            'ts-prune',
            '@mdx-js/*',
            '@next/mdx',
            'remark-*',
            'rehype-*',
            'mdast-*',
            'postcss',
            'autoprefixer'
        ]
    };

    console.log(`Analyzing from directory: ${process.cwd()}`);
    const results = await depcheck(process.cwd(), options);
    
    // Analyze dependency usage
    console.log('=== Unused Dependencies ===');
    if (results.dependencies.length > 0) {
        console.log('\nUnused dependencies:');
        results.dependencies.forEach(dep => {
            console.log(`- ${dep} (${allDeps[dep]})`);
        });
    }

    if (results.devDependencies.length > 0) {
        console.log('\nUnused devDependencies:');
        results.devDependencies.forEach(dep => {
            console.log(`- ${dep} (${allDeps[dep]})`);
        });
    }

    // Check for duplicate dependencies
    console.log('\n=== Duplicate Dependencies ===');
    try {
        const pnpmLs = execSync('pnpm ls --json').toString();
        const deps = JSON.parse(pnpmLs);
        const duplicates = findDuplicates(deps);
        
        if (Object.keys(duplicates).length > 0) {
            console.log('\nDuplicate versions found:');
            Object.entries(duplicates).forEach(([pkg, versions]) => {
                console.log(`- ${pkg}:`);
                versions.forEach(v => console.log(`  - ${v}`));
            });
        }
    } catch (error) {
        console.log('Could not check for duplicates:', error.message);
    }

    // Improved size analysis
    console.log('\n=== Large Dependencies ===');
    try {
        const packageSizes = {};
        const pnpmDir = path.join(process.cwd(), 'node_modules', '.pnpm');
        
        // Get all package directories in .pnpm
        const pnpmDirs = fs.readdirSync(pnpmDir);
        
        // Improved package size calculation
        pnpmDirs.forEach(dir => {
            const match = dir.match(/^(@[^@]+\/)?[^@]+/);
            if (match && allDeps[match[0]]) {
                try {
                    let totalSize = 0;
                    const packageDir = path.join(pnpmDir, dir);
                    function getAllFiles(dirPath, arrayOfFiles) {
                        const files = fs.readdirSync(dirPath);
                        arrayOfFiles = arrayOfFiles || [];

                        files.forEach(file => {
                            const fullPath = path.join(dirPath, file);
                            if (fs.statSync(fullPath).isDirectory()) {
                                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
                            } else {
                                arrayOfFiles.push(fullPath);
                            }
                        });
                        return arrayOfFiles;
                    }

                    const files = getAllFiles(packageDir);

                    files.forEach(filePath => {
                        try {
                            const stats = fs.statSync(filePath);
                            if (stats.isFile()) {
                                totalSize += stats.size;
                            }
                        } catch (e) {
                            // Skip if can't read file
                        }
                    });
                    
                    packageSizes[match[0]] = (packageSizes[match[0]] || 0) + totalSize;
                } catch (e) {
                    // Skip if can't read directory
                }
            }
        });

        const sortedSizes = Object.entries(packageSizes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20); // Show top 20 instead of 10

        console.log('\nTop 20 largest dependencies:');
        sortedSizes.forEach(([dep, size]) => {
            const sizeInMB = size / 1024 / 1024;
            console.log(`- ${dep}: ${sizeInMB.toFixed(2)} MB${sizeInMB > 5 ? ' ⚠️' : ''}`);
        });

        // Add size warnings
        const totalSize = Object.values(packageSizes).reduce((a, b) => a + b, 0) / 1024 / 1024;
        console.log(`\nTotal dependencies size: ${totalSize.toFixed(2)} MB`);
        if (totalSize > 500) {
            console.log('⚠️ Warning: Total dependencies size is very large');
        }
    } catch (error) {
        console.log('Could not analyze package sizes:', error.message);
    }

    // Additional Next.js specific checks
    console.log('\n=== Next.js Specific Analysis ===');
    try {
        const nextConfigPath = path.resolve(process.cwd(), 'next.config.js');
        console.log(`Reading next.config.js from: ${nextConfigPath}`);
        const nextConfig = require(nextConfigPath);
        
        console.log('\nChecking for optimized imports...');
        const optimizedImports = nextConfig.experimental?.optimizePackageImports || [];
        console.log('Currently optimized packages:', optimizedImports);
        
        // Suggest additional packages to optimize
        const commonUILibs = ['@mui/material', '@chakra-ui', '@mantine', 'antd', 'react-icons'];
        const suggestedOptimizations = commonUILibs.filter(lib => 
            allDeps[lib] && !optimizedImports.includes(lib)
        );
        
        if (suggestedOptimizations.length > 0) {
            console.log('\nConsider adding these packages to optimizePackageImports:');
            suggestedOptimizations.forEach(pkg => console.log(`- ${pkg}`));
        }
    } catch (error) {
        console.log('Could not analyze Next.js config:', error.message);
    }
}

function findDuplicates(deps, path = '', result = {}) {
    if (!deps.dependencies) return result;

    Object.entries(deps.dependencies).forEach(([name, info]) => {
        const currentPath = path ? `${path}/${name}` : name;
        if (!result[name]) result[name] = new Set();
        result[name].add(`${info.version} (${currentPath})`);
        findDuplicates(info, currentPath, result);
    });

    return Object.fromEntries(
        Object.entries(result)
            .filter(([, versions]) => versions.size > 1)
    );
}

findUnusedDependencies().catch(console.error);
'@

# Save the analysis script
$scriptPath = ".\dep-analysis\analyze-deps.js"
$analysisScript | Out-File -FilePath $scriptPath -Encoding UTF8

# Run the analysis
Write-Host "Running dependency analysis..."
node $scriptPath | Tee-Object -FilePath $outputFile

# Clean up
Remove-Item $scriptPath

Write-Host "`nAnalysis completed. Results saved to: $outputFile"
Write-Host "`nRecommended actions:"
Write-Host "1. Review unused dependencies and remove unnecessary ones"
Write-Host "2. Check duplicate dependencies and update to use consistent versions"
Write-Host "3. Consider alternatives for large dependencies"
Write-Host "4. Run 'pnpm prune' after removing dependencies"
Write-Host "5. Check the Next.js specific recommendations for optimization"

# Add a quick summary of available npm scripts
Write-Host "`nQuick dependency checks available:"
Write-Host "- pnpm deps:check     : Run depcheck"
Write-Host "- pnpm deps:why       : See why a package is installed"
Write-Host "- pnpm deps:analyze   : Analyze bundle size"
Write-Host "- pnpm deps:unused-exports : Find unused exports" 