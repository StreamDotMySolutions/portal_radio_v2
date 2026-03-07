export const shouldRenderContent = ({settings}) => {
    if (settings.active == 0) {
        return false;
    }

    if (settings.published_start) {
        // Get the current date
        const currentDate = new Date();
        // Get the published start date from settings.published_start
        const publishedStartDate = new Date(settings.published_start);
        // Compare the current date to the published start date
        if (currentDate < publishedStartDate) {
            // If current date is before published start date, return false
            return false;
        }
    }
    if (settings.published_end) {
        // Get the current date
        const currentDate = new Date();
        // Get the published end date from settings.published_end
        const publishedEndDate = new Date(settings.published_end);
        // Compare the current date to the published end date
        if (currentDate > publishedEndDate) {
            // If current date is after published end date, return false
            return false;
        }
    }
    // If published start date is null or current date is after published start date, return true
    return true;
};