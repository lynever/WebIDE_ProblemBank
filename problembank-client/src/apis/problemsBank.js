import axiosClient from './axios'

const problemsBank = {
    getCategory: (params) => {
        const url = '/problems/getcategory';
        return axiosClient.get(url, { params });
    },
    getProblemsBankByCategoryID: (params) => {
        const url = '/problems/category';
        return axiosClient.get(url, { params });
    },
    getProblemAllData: (params) => {
        const url = '/problems/problemsdata';
        return axiosClient.get(url);
    },
    getProblemInformation: (params) => {
        const url = '/problems/getproblemsinfor';
        return axiosClient.get(url);
    },
    ProblemToMyList: (params) => {
        const url = '/problems/problemtomylist';
        return axiosClient.post(url, params);
    },
    getProblemFromMyList: (params) => {
        const url = '/problems/getmyproblems';
        return axiosClient.get(url);
    }
}

export default problemsBank;