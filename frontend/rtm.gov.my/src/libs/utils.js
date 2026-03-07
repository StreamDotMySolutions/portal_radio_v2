export function truncateTitleWithBreaks(title, wordLimit) {
    const words = title.split(' ');

    if (words.length > wordLimit) {
        let truncatedTitle = '';
        for (let i = 0; i < words.length; i++) {
            truncatedTitle += words[i];
            if ((i + 1) % wordLimit === 0 && i !== words.length - 1) {
                truncatedTitle += ' <br /> ';
            } else {
                truncatedTitle += ' ';
            }
        }
        return truncatedTitle.trim();
    } else {
        return title;
    }
}
