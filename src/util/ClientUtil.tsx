import Client from "../data/Client";

export const clientSortFunc = (clients: Client[]): Client[] => {
    return clients.sort(clientCompareFunction)
}

export const clientCompareFunction = (c1: Client, c2: Client) => {
    const lastName = c1.lastName.localeCompare(c2.lastName)
    if (lastName !== 0) {
        return lastName;
    }
    const firstName = c1.firstName.localeCompare(c2.firstName);
    if (firstName !== 0) {
        return firstName;
    }
    const c1m = c1.middleName || '';
    const c2m = c2.middleName || '';
    return c1m.localeCompare(c2m);
}

export const clientFilterFunc = (searchString: string, c: Client[]): Client[] => {
    const newFilter =
        '.*' + searchString.toLowerCase().split(' ').reduce((l, c) => {
            return (l + '.*' + c)
        }) + '.*';
    const regex = RegExp(newFilter);
    return c.filter((c) => (c.last4Ssn + ' ' + c.fullName + ' ' + c.last4Ssn).toLowerCase().match(regex));
}