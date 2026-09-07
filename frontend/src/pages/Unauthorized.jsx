function Unauthorized() {

    return (

        <div className="min-h-screen bg-[#f1f6fb] text-center pt-30">

            <h1 className="text-4xl font-bold text-red-600">
                Access Denied
            </h1>

            <p className="mt-4 text-gray-600">
                You don't have permission to access this page.
            </p>

        </div>

    );
}

export default Unauthorized;