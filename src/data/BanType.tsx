export enum BanType {
    DateBan = 'DB',
    IndefiniteBan = 'IB',
    PermanentBan = 'PB'

}

export const parseBanType = (s: string) => {
    switch(s) {
        case 'DB': return BanType.DateBan;
        case 'IB': return BanType.IndefiniteBan;
        case 'PB': return BanType.PermanentBan;
        default: return BanType.DateBan;
    }
}