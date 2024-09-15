import GoogleOAuth from '../google-oauth/Google.OAuth';
import PhoneNumberLoginButton from './Phone.Login';


export default function LoginModalContainer( {setStep}) {
  return (
    <div>
        <div>
            <div>
              <div className='flex justify-center align-items-center'>
                <img src="/images/logo-color.png" className=' w-[50px] h-[50px] object-cover' />
              </div>
              <div className='flex justify-center align-items-center mt-3'>
                <h1 className='font-bold text-[35px] font-Roboto tracking-[.25rem] text-[#666666]'>Bắt đầu</h1>
              </div>
              <div className='flex justify-center align-items-center mt-3 text-center'>
                <p className='px-[55px] text-[12px] font-semibold font-Roboto tracking-[10%] text-[#666666]'>
                  Khi nhấn vào Đăng Nhập, bạn đồng ý với{' '}
                  <a
                    href="#"
                    className="underline text-blue-500 hover:text-blue-700"
                  >
                    Điều khoản
                  </a>{' '}
                  của chúng tôi. Tìm hiểu về cách chúng tôi xử lý dữ
                  liệu của bạn trong{' '}
                  <a
                    href="#"
                    className="underline text-blue-500 hover:text-blue-700"
                  >
                    Chính sách quyền riêng tư
                  </a>{' '}
                  và{' '}
                  <a
                    href="#"
                    className="underline text-blue-500 hover:text-blue-700"
                  >
                    Chính sách Cookie
                  </a>{' '}
                  của chúng tôi.
                </p>
              </div>
              {/* Login Section  */}
              <div className='flex justify-center align-items-center mt-6 text-center w-full'>
                <GoogleOAuth />
              </div>
              <div className='flex justify-center align-items-center mt-3 mb-10 text-center w-full'>
                <PhoneNumberLoginButton setStep={setStep} />
              </div>
            </div>
          </div>
    </div>
  )
}
