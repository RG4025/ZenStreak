

interface RegisterPayload {
    fullName: string,
    userName: string,
    email: string,
    password: string,

}



export const registerUser = async (data: RegisterPayload) => {
    const response = await RequestHandler.post("/user/signup", data);
}