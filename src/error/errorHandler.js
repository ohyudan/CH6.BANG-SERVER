export const handlerError = async (socket, error) => {
  let responseCode;
  let message;

  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러 코드: ${error.code}, 메시지: ${error.message}`);
  } else {
    console.error(`Unknown Error: ${error}`);
  }
};
