import { RefreshCw, ServerCrash } from "lucide-react";


function ServerError({
    onRetry,
}) {

    return (

        <div className="w-full flex items-center justify-center px-6 py-16">

            <div className="
                w-full
                max-w-lg
                bg-white
                border
                border-gray-200
                rounded-2xl
                shadow-sm
                px-8
                py-10
                text-center
            ">

                <div className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-red-50
                    flex
                    items-center
                    justify-center
                    mb-6
                ">

                    <ServerCrash
                        size={30}
                        className="text-red-500"
                    />

                </div>


                <h2 className="
                    text-2xl
                    font-bold
                    text-gray-900
                ">

                    Unable to connect to MediCare

                </h2>


                <p className="
                    mt-3
                    text-sm
                    leading-6
                    text-gray-500
                    max-w-md
                    mx-auto
                ">

                    We're unable to reach the server right now.
                    Please check your connection or try again
                    in a moment.

                </p>


                <button
                    type="button"
                    onClick={onRetry}
                    className="
                        mt-7
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        text-sm
                        font-semibold
                        transition
                    "
                >

                    <RefreshCw size={17} />

                    Try Again

                </button>

            </div>

        </div>

    );

}


export default ServerError;