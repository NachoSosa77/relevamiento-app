
import { MenuItem } from '@/interfaces/MenuIterface';
import axiosInstance from '@/utils/axiosInstance';

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get<MenuItem[]>('api/menu');
    //console.log(response.data)
    console.log("consultando...")
    return response.data;
};
