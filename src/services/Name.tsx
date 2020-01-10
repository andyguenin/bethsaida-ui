export async function getName(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "andy";
};