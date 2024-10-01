export default function TestUI() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-custom-gradient">
            <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-72 h-72  bg-white bg-opacity-20 rounded-full animate-pulse-custom"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full animate-pulse-custom"></div>
                </div>
                <div className=" p-10 animate-pulse-custom">
                    <img src="/images/logo-color.png" className="w-56" />
                </div>
            </div>
        </div>
    );
}
