export type Airport = 'NZAA' | 'NZCH' | 'NZDN' | 'NZHK' | 'NZNP' | 'NZNR' | 'NZNS' | 'NZPM' | 'NZQN' | 'NZTG' | 'NZWB' | 'NZWN';

export function cityName(a: Airport): string {
    switch (a) {
        case 'NZAA': return 'Auckland';
        case 'NZCH': return 'Christchurch';
        case 'NZDN': return 'Dunedin';
        case 'NZHK': return 'Hokitika';
        case 'NZNP': return 'New Plymouth';
        case 'NZNR': return 'Napier';
        case 'NZNS': return 'Nelson';
        case 'NZPM': return 'Palmerston North';
        case 'NZQN': return 'Queenstown';
        case 'NZTG': return 'Tauranga';
        case 'NZWB': return 'Blenheim';
        case 'NZWN': return 'Wellington';
    }
}

/** should be route but want to avoid any mix up with angular routing */
export interface AirRoute {
    origin: Airport;
    destination: Airport;
    distance: number;
}