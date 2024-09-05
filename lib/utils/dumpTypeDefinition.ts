export function dumpTypeDefinition(obj: any): string {
    const getType = (value: any): string => {
        if (value === null) return 'null';
        if (Array.isArray(value)) return `${getType(value[0])}[]`;
        if (typeof value === 'object') {
            const entries = Object.entries(value)
                .map(([key, val]) => `${key}: ${getType(val)}`)
                .join('; ');
            return `{ ${entries} }`;
        }
        return typeof value;
    };

    return getType(obj);
}