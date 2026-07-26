import axios from "axios";
import useLoadingStore from "src/store/LodingStore";
import docCookies from "src/utils/cookies";

const Axios = axios.create();

const { setLoading } = useLoadingStore.getState();

Axios.interceptors.request.use(
	(config) => {
		setLoading(true);
		config.headers.Authorization = docCookies.getItem("sessionId") || "";

		// 记录发起时间,给耗时统计用
		(config as any).metadata = { startTime: Date.now() };
		console.log(`[Axios] → ${config.method?.toUpperCase()} ${config.url}`, config.data);

		return config;
	},
	(error) => {
		setLoading(false);
		console.error("[Axios] request error", error);
		return Promise.reject(error);
	}
)

Axios.interceptors.response.use(
	(response) => {
		const duration = Date.now() - (response.config as any).metadata?.startTime;
		console.log(`[Axios] ← ${response.status} ${response.config.url} (${duration}ms)`, response.data);

		if (response.status === 200) {
			if (response.data.code === 400) {
				console.error("bad qurey params", response.data.msg);
			}
		}
		setLoading(false);
		return response;
	},
	(error) => {
		console.error("[Axios] response error", error.response?.status, error.response?.data);
		setLoading(false);
		return Promise.reject(error);
	}
)

export default Axios
