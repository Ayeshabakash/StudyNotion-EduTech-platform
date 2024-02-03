import {catalogData} from "../apis";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";


export const getCatalogPageData = async(categoryId, token) => {
    const toastId = toast.loading("loading...");
    let result;

    try{
        const response = await apiConnector("POST" , catalogData.CATALOGPAGEDATA_API , {categoryId: categoryId});

        if(!response?.data?.success)
        {
            throw new Error("Catalog data could not be fetched");
        }

        console.log("GET CATALOG PAGE DATA API RESPONSE: ", response);

        result = response.data?.data;
    }
    catch(error){
        console.log("GET CATALOG PAGE DATA API ERROR", error);
        console.log(error.message);
        toast.error("Catalog Couses could not be fetched");
    }
    toast.dismiss(toastId);
    return result;
}
