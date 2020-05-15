export default class ArrayUtil {

    public static getUniqueElements<E>(a: E[]): E[] {
        return a.filter((v, i) => {
            if(i === 0) {
                return true
            } else {
                return +v !== +a[i - 1];
            }
        })
    }
}