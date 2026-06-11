"use client";

import axios from "axios";

const axiosN8nApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_N8N_API_URL,
	withCredentials: true
});

export default axiosN8nApi;
