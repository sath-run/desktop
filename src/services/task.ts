import {request} from '@/utils/net';


/**
 * 任务下面的Job
 * @param params
 *  */
export async function jobs(params: API.JobsParams) {
    return {
        success: true,
        data: {
            "jobs": [
                {
                    "id": 28,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:23:50.746889+08:00",
                    "completedAt": "2022-07-14T19:23:56.2487+08:00",
                    "status": "success"
                },
                {
                    "id": 29,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:23:56.329449+08:00",
                    "completedAt": "2022-07-14T19:24:02.026815+08:00",
                    "status": "success"
                },
                {
                    "id": 30,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:24:02.097202+08:00",
                    "completedAt": "2022-07-14T19:24:09.563307+08:00",
                    "status": "success"
                },
                {
                    "id": 31,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:24:09.626939+08:00",
                    "completedAt": "2022-07-14T19:24:16.483212+08:00",
                    "status": "success"
                },
                {
                    "id": 32,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:24:16.530357+08:00",
                    "completedAt": "2022-07-14T19:24:24.336267+08:00",
                    "status": "success"
                },
                {
                    "id": 33,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:24:24.400112+08:00",
                    "completedAt": "2022-07-14T19:24:33.002438+08:00",
                    "status": "success"
                },
                {
                    "id": 34,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:24:33.055807+08:00",
                    "completedAt": "2022-07-14T19:24:42.675593+08:00",
                    "status": "success"
                },
                {
                    "id": 35,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:04:18.401493+08:00",
                    "completedAt": "2022-07-14T20:04:24.396654+08:00",
                    "status": "success"
                },
                {
                    "id": 36,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:04:24.452139+08:00",
                    "completedAt": "2022-07-14T20:04:30.829055+08:00",
                    "status": "success"
                },
                {
                    "id": 37,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:04:30.879295+08:00",
                    "completedAt": "2022-07-14T20:04:38.124083+08:00",
                    "status": "success"
                },
                {
                    "id": 38,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:04:38.179833+08:00",
                    "completedAt": "2022-07-14T20:04:45.700018+08:00",
                    "status": "success"
                },
                {
                    "id": 39,
                    "algo": "GA/GACAAE/00000/Z1720922525_1_T1.pdbqt",
                    "receptor": "4no7_prot.pdbqt",
                    "dispatchedAt": "2022-07-14T20:25:22.991325+08:00",
                    "completedAt": "2022-07-14T20:25:30.427993+08:00",
                    "status": "success"
                },
                {
                    "id": 40,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:06:11.225688+08:00",
                    "completedAt": "2022-07-14T20:06:17.671553+08:00",
                    "status": "success"
                },
                {
                    "id": 41,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:06:17.71937+08:00",
                    "completedAt": "2022-07-14T20:06:25.804477+08:00",
                    "status": "success"
                },
                {
                    "id": 42,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:06:25.906587+08:00",
                    "completedAt": "2022-07-14T20:06:35.793253+08:00",
                    "status": "success"
                },
                {
                    "id": 43,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:33:04.010432+08:00",
                    "completedAt": "2022-07-14T20:33:10.598835+08:00",
                    "status": "success"
                },
                {
                    "id": 44,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:07:50.875671+08:00",
                    "completedAt": "2022-07-14T20:07:56.423245+08:00",
                    "status": "success"
                },
                {
                    "id": 45,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:07:56.468302+08:00",
                    "completedAt": "2022-07-14T20:08:02.52119+08:00",
                    "status": "success"
                },
                {
                    "id": 46,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T20:08:02.566593+08:00",
                    "completedAt": "2022-07-14T20:08:09.883389+08:00",
                    "status": "success"
                }
            ],
            "total": 16
        }
    }
    // return request.get<API.Response<{ jobs: API.TaskJob[], total: number }>>(`/jobs`, {params});
}

/**
 * 任务积分
 * @param params
 *  */
export async function integrals(params: API.JobsIntegralParams) {
    return {
        success: true,
        data: {
            "jobs": [
                {
                    "id": 28,
                    "jobId": 22,
                    "score": 100,
                    "algo": "qvina02",
                    "dispatchedAt": "2022-07-14T19:23:50.746889+08:00",
                    "completedAt": "2022-07-14T19:23:56.2487+08:00",
                    "status": "success"
                },
                {
                    "id": 29,
                    "jobId": 2332,
                    "score": 100,
                    "algo": "qvina02",
                    "receptor": "4no7_prot.pdbqt",
                    "dispatchedAt": "2022-07-14T19:23:56.329449+08:00",
                    "completedAt": "2022-07-14T19:24:02.026815+08:00",
                    "status": "success"
                },
                {
                    "id": 30,
                    "jobId": 212,
                    "score": 100,
                    "algo": "qvina02",
                    "receptor": "4no7_prot.pdbqt",
                    "dispatchedAt": "2022-07-14T19:24:02.097202+08:00",
                    "completedAt": "2022-07-14T19:24:09.563307+08:00",
                    "status": "success"
                },
                {
                    "id": 31,
                    "jobId": 213,
                    "score": 100,
                    "algo": "qvina02",
                    "receptor": "smina",
                    "dispatchedAt": "2022-07-14T19:24:09.626939+08:00",
                    "completedAt": "2022-07-14T19:24:16.483212+08:00",
                    "status": "success"
                },
                {
                    "id": 32,
                    "jobId": 22,
                    "score": 100,
                    "algo": "qvina02",
                    "receptor": "smina",
                    "dispatchedAt": "2022-07-14T19:24:16.530357+08:00",
                    "completedAt": "2022-07-14T19:24:24.336267+08:00",
                    "status": "success"
                },
                {
                    "id": 33,
                    "jobId": 213,
                    "score": 100,
                    "algo": "smina",
                    "receptor": "4no7_prot.pdbqt",
                    "dispatchedAt": "2022-07-14T19:24:24.400112+08:00",
                    "completedAt": "2022-07-14T19:24:33.002438+08:00",
                    "status": "success"
                },
                {
                    "id": 34,
                    "jobId": 333,
                    "score": 100,
                    "algo": "smina",
                    "receptor": "4no7_prot.pdbqt",
                    "dispatchedAt": "2022-07-14T19:24:33.055807+08:00",
                    "completedAt": "2022-07-14T19:24:42.675593+08:00",
                    "status": "success"
                },
                {
                    "id": 35,
                    "jobId": 112,
                    "score": 100,
                    "algo": "qvina02",
                    "receptor": "4no7_prot.pdbqt",
                    "dispatchedAt": "2022-07-14T20:04:18.401493+08:00",
                    "completedAt": "2022-07-14T20:04:24.396654+08:00",
                    "status": "success"
                }
            ],
            "total": 16
        }
    }
    // return request.get<API.Response<{ jobs: API.TaskIntegral[], total: number }>>(`/jobs/integral`, {params});
}