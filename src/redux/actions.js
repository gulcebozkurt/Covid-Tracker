import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { headers } from "../utils/constants";

export const getData = createAsyncThunk(
    "covid/getData",
    async ({ code, query }) => {
        // api ye gönderilcek parametreleri hazırlama
        const params = { iso: code, q: query };

        // ülkenin covid bilgilerini alan istek
        const req1 = axios.get(
            "https://covid-19-statistics.p.rapidapi.com/reports",
            {
                params,
                headers,
            }
        );

        //ülkenin detay verilerini alan istek
        const req2 = axios.get(
            code
                ? `https://restcountries.com/v3.1/alpha/${code}`
                : `https://restcountries.com/v3.1/name/${query}`
        );

        // her iki api isteğini aynı anda gönderme
        const responses = await Promise.all([req1, req2]);

        // cregion veirlerini bir üst nesne ile aynı düzeye çıkarma
        const covid = {
            ...responses[0].data.data[0],
            ...responses[0].data.data[0].region,
        };

        // gereksiz verileri kaldırma
        delete covid.region;
        delete covid.cities;

        // aksiyonun payload'ı return etme
        return { covid, country: responses[1].data[0] };
    }
);

export default getData;
