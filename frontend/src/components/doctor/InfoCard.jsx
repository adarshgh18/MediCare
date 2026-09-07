function InfoCard({ icon, title, value }) {

    return (

        <div className="bg-white border border-gray-200 rounded-2xl p-1.75 shadow-sm hover:shadow-md transition">

            <div className="text-blue-600 text-2xl mb-2">

                {icon}

            </div>

            <h3 className="text-gray-500 text-sm">

                {title}

            </h3>

            <p className="font-semibold text-lg mt-1">

                {value}

            </p>

        </div>

    );

}

export default InfoCard;

