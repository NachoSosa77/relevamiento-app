import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchMenuItems } from '../menu/menu';
import { MenuItem } from '@/interfaces/MenuIterface';
import { useEffect } from 'react';

export const useMenuItems = (): UseQueryResult<MenuItem[], Error> => {
  return useQuery<MenuItem[], Error>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const cachedData = localStorage.getItem('menuItems');
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const data = await fetchMenuItems();
      localStorage.setItem('menuItems', JSON.stringify(data));
      return data;
    },
    // staleTime: 1000 * 60 * 60, // 1 hora
  });
};
