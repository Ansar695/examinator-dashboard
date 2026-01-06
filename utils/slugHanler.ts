export const boardNameFromSlug = (boardSlug: string) => {
    const boardName = boardSlug
    ? boardSlug
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

    return boardName;
}

export const classNameFromSlug = (classSlug: string) => {
    const className = classSlug
    ? classSlug
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

    return className;
}

export const subjectNameFromSlug = (subjectSlug: string) => {
    const subjectName = subjectSlug
    ? subjectSlug
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

    return subjectName;
}