const qs = require("qs");
const { default: axios } = require("axios");

const reservationMemberData: IReservationMemberData[] = [
  ////////////////////////////////////////////////////
  // 인철이형 계정
  ////////////////////////////////////////////////////
  // {
  //   nickname: "인철이형 계정",
  //   cookie: "JSESSIONID=C8ACD94DD03B91ACA3190B0908AF4E95",
  //   reservationData: [
  //     // 주말반
  //     {
  //       reservDate: "20220807",
  //       timeCode: "TM046",
  //       courtCode: "TC001",
  //       adultCnt: 3,
  //     },
  //     {
  //       reservDate: "20220807",
  //       timeCode: "TM047",
  //       courtCode: "TC001",
  //       adultCnt: 3,
  //     },

  //     {
  //       reservDate: "20220814",
  //       timeCode: "TM046",
  //       courtCode: "TC001",
  //       adultCnt: 3,
  //     },
  //     {
  //       reservDate: "20220814",
  //       timeCode: "TM047",
  //       courtCode: "TC001",
  //       adultCnt: 3,
  //     },

  //     // 평일반
  //     {
  //       reservDate: "20220804",
  //       timeCode: "TM052",
  //       courtCode: "TC001",
  //       adultCnt: 3,
  //     },
  //     {
  //       reservDate: "20220809",
  //       timeCode: "TM052",
  //       courtCode: "TC001",
  //       adultCnt: 3,
  //     },
  //   ],
  // },

  ////////////////////////////////////////////////////
  // 다른 계정
  ////////////////////////////////////////////////////
  {
    nickname: "형수님 계정",
    cookie: "JSESSIONID=",
    reservationData: [
      // 주말반
      // {
      //   reservDate: "20220805",
      //   timeCode: "TM056",
      //   courtCode: "TC002",
      //   adultCnt: 2,
      // },
      // {
      //   reservDate: "20220807",
      //   timeCode: "TM049",
      //   courtCode: "TC002",
      //   adultCnt: 2,
      // },
      // {
      //   reservDate: "20220814",
      //   timeCode: "TM048",
      //   courtCode: "TC002",
      //   adultCnt: 2,
      // },
      // {
      //   reservDate: "20220814",
      //   timeCode: "TM049",
      //   courtCode: "TC002",
      //   adultCnt: 2,
      // },
    ],
  },
];

start();

async function start() {
  for (const reservationMemberDataOne of reservationMemberData) {
    console.log(`${reservationMemberDataOne.nickname} 계정 예약 시작`);

    for (const reservationDataOne of reservationMemberDataOne.reservationData) {
      try {
        // 날짜 선택
        await axiosProcessing({
          url: "/user/tennis/tennisInsideReservDayCheck.do",
          data: {
            reservDate: reservationDataOne.reservDate,
          },
          cookie: reservationMemberDataOne.cookie,
        });

        // 시간 선택
        await axiosProcessing({
          url: "/user/tennis/tennisReservNext0Check.do",
          data: {
            timeCode: reservationDataOne.timeCode,
            fromTime: FromTime[reservationDataOne.timeCode],
            toTime: ToTime[reservationDataOne.timeCode],
            menuId: "InsideResv",
          },
          cookie: reservationMemberDataOne.cookie,
        });

        // 코트 선택
        await axiosProcessing({
          url: "/user/tennis/tennisReservNext1Check.do",
          data: {
            courtCode: reservationDataOne.courtCode,
            courtNo: CourtNo[reservationDataOne.courtCode],
            menuId: "InsideResv",
          },
          cookie: reservationMemberDataOne.cookie,
        });

        // 이용 구분
        await axiosProcessing({
          url: "/user/tennis/tennisReservNext2Check.do",
          data: {
            useTypeCd: "002",
            useTypeNm: "연습이용",
            menuId: "InsideResv",
          },
          cookie: reservationMemberDataOne.cookie,
        });

        // 인원 선택
        await axiosProcessing({
          url: "/user/tennis/tennisReservNext3Check.do",
          data: {
            adultCnt: reservationDataOne.adultCnt,
            youthCnt: "0",
            oldManCnt: "0",
            gCardCnt: "0",
            mChildCnt: "0",
            useLightYn: "N",
            menuId: "InsideResv",
          },
          cookie: reservationMemberDataOne.cookie,
        });

        // 최종 예약
        await axiosProcessing({
          url: "/user/tennis/tennisReservNext4Check.do",
          data: {
            deal_type: "CARD",
            menuId: "InsideResv",
          },
          cookie: reservationMemberDataOne.cookie,
        });

        // console.log();
      } catch (error) {
        console.log(
          `${reservationDataOne.reservDate} - ${
            FromTime[reservationDataOne.timeCode]
          } - ${CourtNo[reservationDataOne.courtCode]}코트 예약 실패`
        );
      }
    }
  }
}

async function axiosProcessing({ url, data, cookie }) {
  const result = await axios.post(
    "https://reserve.gmuc.co.kr" + url,
    qs.stringify(data),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
      },
    }
  );

  // 날짜 선택 후 예약 가능 시간 확인
  // if(url === "/user/tennis/tennisReservDayCheck.do"){
  //   result.data.includes(`id="${data.}'`)
  // }

  // 최종 예약은 결과 표시하기
  if (url === "/user/tennis/tennisReservNext4Check.do") {
    console.log(result.data);
  }
}

interface IReservationMemberData {
  nickname: string;
  cookie: string;
  reservationData: IReservationData[];
}
interface IReservationData {
  /**
   * 예약날짜
   */
  reservDate: string;

  /**
   * 예약 시간
   */
  timeCode: // | "TM045" // 06:00 ~ 08:00
  // | "TM046" // 08:00 ~ 10:00
  // | "TM047" // 10:00 ~ 12:00
  // | "TM048" // 12:00 ~ 14:00
  // | "TM049" // 14:00 ~ 16:00
  // | "TM050" // 16:00 ~ 18:00
  // | "TM051" // 18:00 ~ 20:00
  // | "TM052"; // 20:00 ~ 22:00
  | "TM053" // 06:00 ~ 08:00
    | "TM054" // 08:00 ~ 10:00
    | "TM055" // 10:00 ~ 12:00
    | "TM056" // 12:00 ~ 14:00
    | "TM057" // 14:00 ~ 16:00
    | "TM058" // 16:00 ~ 18:00
    | "TM059" // 18:00 ~ 20:00
    | "TM060"; // 20:00 ~ 22:00

  // fromTime: "18:00",
  //   toTime: "20:00",

  /**
   * 예약 코트 코드
   */
  courtCode:
    | "TC001"
    | "TC002"
    | "TC003"
    | "TC004"
    | "TC005"
    | "TC006"
    | "TC007"
    | "TC008"
    | "TC009"
    | "TC010"
    | "TC011"
    | "TC012"
    | "TC013";
  // courtNo: "2",

  // /**
  //  * 이용 구분
  //  */
  // useTypeCd: "002",
  // useTypeNm: "연습이용",

  /**
   * 성인 인원
   */
  adultCnt: number;
}

enum FromTime {
  "TM053" = "06:00",
  "TM054" = "08:00",
  "TM055" = "10:00",
  "TM056" = "12:00",
  "TM057" = "14:00",
  "TM058" = "16:00",
  "TM059" = "18:00",
  "TM060" = "20:00",
}
enum ToTime {
  "TM053" = "08:00",
  "TM054" = "10:00",
  "TM055" = "12:00",
  "TM056" = "14:00",
  "TM057" = "16:00",
  "TM058" = "18:00",
  "TM059" = "20:00",
  "TM060" = "22:00",
}

enum CourtNo {
  "TC001" = "1",
  "TC002" = "2",
  "TC003" = "3",
  "TC004" = "4",
  "TC005" = "5",
  "TC006" = "6",
  "TC007" = "7",
  "TC008" = "8",
  "TC009" = "9",
  "TC010" = "10",
  "TC011" = "11",
  "TC012" = "12",
  "TC013" = "13",
}
