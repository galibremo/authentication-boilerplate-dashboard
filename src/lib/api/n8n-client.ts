import { type AxiosRequestConfig } from "axios";

import { normalizeApiError } from "@/lib/api/errors";
import axiosN8nApi from "@/lib/n8n-client-api";

export async function n8nApiClient<TData>(config: AxiosRequestConfig): Promise<TData> {
    try {
        const { data: response } = await axiosN8nApi<ApiResponse<TData>>(config);
        return response.data;
    } catch (error) {
        throw normalizeApiError(error);
    }
}

