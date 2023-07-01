export const capitalizeTitle = (title: string) => {
     const titleCapitalized = title
        .split(" ")
        .map((str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        })
        .join(" ");
        return titleCapitalized
}

export const calculateMinutes = (date: Date) => {
    const ahora = new Date();
    return Math.floor(
        (ahora.getTime() - date.getTime()) / 60000);
};
