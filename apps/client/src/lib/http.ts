import axios from "axios";
import { toast } from "sonner";

import { API_URL } from "~/config";

const http = axios.create({ baseURL: API_URL });

const getToken = () => {
  if (typeof window === "undefined") return;

  return localStorage.getItem("token");
};

http.interceptors.request.use(async (request) => {
  const token = getToken();

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

const handleError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return toast.error("An unexpected error occurred");
  }

  if (!error.response) {
    return toast.error("Could not connect to the server");
  }

  if (error.response.status === 401) {
    return toast.error("Unauthorized");
  }

  const { errors, message } = error.response.data as {
    errors?: string[];
    message: string;
  };

  return toast.error(message, {
    description: errors?.length && errors.join(", ")
  });
};

const fetcher = (url: string) => http.get(url).then((res) => res.data);

const uploadFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await http.post<string[]>("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

export { fetcher, handleError, http, uploadFiles };
