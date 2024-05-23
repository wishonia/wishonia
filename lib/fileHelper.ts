export function convertToRelativePath(absolutePath: string): string {
    // Split the coverImage path into an array of directories
    let pathArray = absolutePath.split(/\/|\\/);
    // Find the index of the 'public' directory
    let publicIndex = pathArray.indexOf('public');
    // If 'public' directory is not found, return the original path
    if (publicIndex === -1) { return absolutePath; }
    // Get the path after the 'public' directory
    return '/' + pathArray.slice(publicIndex + 1).join('/');
}
