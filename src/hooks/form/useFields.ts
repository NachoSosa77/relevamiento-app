import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { apiFiels } from "@/interfaces/api.interfaces/ApiFields";
import { Member } from "@/interfaces/api.interfaces/ApiForms";

const useFields = (config: Member) => {
  const [fields, setFields] = useState<apiFiels[]>([]);
  const [loadingFields, setLoadingFields] = useState<boolean>(true);
  const [fieldsError, setFieldsError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldPromises = config.fields.map((fieldUrl) =>
          axiosInstance.get(fieldUrl).then((response) => response.data)
        );
        const fieldData: apiFiels[] = await Promise.all(fieldPromises);
        setFields(fieldData);
      } catch (error) {
        console.error("Error fetching fields:", error);
        setFieldsError(error as Error);
      } finally {
        setLoadingFields(false);
      }
    };

    if (config.fields?.length) {
      fetchFields();
    } else {
      setLoadingFields(false);
    }
  }, [config.fields]);

  return { fields, loadingFields, fieldsError };
};

export default useFields;
