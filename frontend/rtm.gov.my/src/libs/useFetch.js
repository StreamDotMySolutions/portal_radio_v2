import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!url) return;
        setIsLoading(true);
        axios(url)
            .then(res => setData(res.data))
            .catch(err => console.warn(err))
            .finally(() => setIsLoading(false));
    }, [url]);

    return { data, isLoading };
};

export default useFetch;
