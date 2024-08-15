export function formatNumber(value: number): string {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new TypeError('Value must be a number.');
    }

    let formattedValue: string;

    if (value >= 1_000_000_000) {
        formattedValue = `${(value / 1_000_000_000).toFixed(3)}B`;
    } else if (value >= 1_000_000) {
        formattedValue = `${(value / 1_000_000).toFixed(3)}M`;
    } else if (value >= 1_000) {
        formattedValue = `${(value / 1_000).toFixed(3)}K`;
    } else if (value <= 1) {
        formattedValue = value.toFixed(5);
    } else {
        formattedValue = value.toFixed(3);
    }

    if (value < 1_000) {
        formattedValue = formattedValue.replace(/\.?0+$/, '');
    }

    return formattedValue;
}
