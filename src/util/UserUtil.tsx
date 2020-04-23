import Client from "../data/Client";
import User from "../data/User";

export const userSortFunc = (user: User[]): User[] => {
    return user.sort((c1, c2) => {
        const lastName = c1.lastName.localeCompare(c2.lastName)
        if (lastName !== 0) {
            return lastName;
        }
        return c1.firstName.localeCompare(c2.firstName);
    })

}

export const userFilterFunc = (searchString: string, users: User[]): User[] => {
    const newFilter =
        '.*' + searchString.toLowerCase().split(' ').reduce((l, c) => {
            return (l + '.*' + c)
        }) + '.*';
    const regex = RegExp(newFilter);
    return users.filter((c) => c.getFullName().toLowerCase().match(regex));
}