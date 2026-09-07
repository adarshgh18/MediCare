import { useNavigate } from "react-router-dom";
import {
    Home,
    ArrowLeft,
    SearchX,
    HeartPulse,
} from "lucide-react";


function NotFound() {

    const navigate = useNavigate();


    return (

        <div className="
            min-h-[calc(100vh-80px)]
            flex
            items-center
            justify-center
            px-4
            py-12
        ">

            <div className="
                w-full
                max-w-xl
                text-center
            ">

                {/* Icon */}

                <div className="
                    w-20
                    h-20
                    mx-auto
                    rounded-2xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    mb-6
                ">

                    <SearchX
                        size={38}
                        className="text-blue-600"
                    />

                </div>


                {/* 404 */}

                <p className="
                    text-7xl
                    md:text-8xl
                    font-extrabold
                    text-blue-600
                    tracking-tight
                ">

                    404

                </p>


                {/* Heading */}

                <h1 className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    text-gray-900
                    mt-3
                ">

                    Page not found

                </h1>


                {/* Description */}

                <p className="
                    max-w-md
                    mx-auto
                    text-sm
                    md:text-base
                    text-gray-500
                    leading-6
                    mt-3
                ">

                    Sorry, we couldn't find the page you're
                    looking for. It may have been moved,
                    removed, or the URL might be incorrect.

                </p>


                {/* Buttons */}

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-center
                    gap-3
                    mt-7
                ">

                    {/* Go Home */}

                    <button
                        onClick={() => navigate("/")}
                        className="
                            w-full
                            sm:w-auto
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5
                            py-2.5
                            rounded-xl
                            text-sm
                            font-semibold
                            transition
                            shadow-sm
                        "
                    >

                        <Home size={17} />

                        Go to Home

                    </button>


                    {/* Go Back */}

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            w-full
                            sm:w-auto
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            bg-white
                            hover:bg-gray-50
                            border
                            border-gray-200
                            text-gray-700
                            px-5
                            py-2.5
                            rounded-xl
                            text-sm
                            font-semibold
                            transition
                        "
                    >

                        <ArrowLeft size={17} />

                        Go Back

                    </button>

                </div>


                {/* MediCare branding */}

                <div className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    mt-10
                    text-gray-400
                ">

                    <HeartPulse size={16} />

                    <span className="text-xs font-medium">
                        MediCare
                    </span>

                </div>

            </div>

        </div>

    );

}


export default NotFound;