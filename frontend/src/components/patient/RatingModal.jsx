import { useState } from "react";
import { Star, X } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";


function RatingModal({ appointment, onClose, onSuccess }) {

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const doctorName =
        appointment?.doctor?.user?.fullName || "Doctor";


    const handleSubmit = async () => {

        if (rating === 0) {

            toast.error("Please select a rating.");

            return;

        }


        try {

            setSubmitting(true);


            const response = await api.post(
                "/reviews",
                {
                    appointmentId: appointment._id,
                    rating,
                    comment,
                }
            );


            toast.success(
                response.data.message ||
                "Review submitted successfully."
            );


            onSuccess(response.data.review);


            onClose();

        }

        catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Failed to submit review."
            );

        }

        finally {

            setSubmitting(false);

        }

    };


    return (

        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/40
                px-4
            "
            onClick={onClose}
        >

            <div
                className="
                    bg-white
                    w-full
                    max-w-md
                    rounded-2xl
                    shadow-xl
                    p-6
                "
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}

                <div className="flex items-start justify-between">

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">

                            Rate your experience

                        </h2>

                        <p className="text-sm text-gray-500 mt-1">

                            How was your appointment with{" "}

                            <span className="font-medium text-gray-700">

                                Dr. {doctorName}

                            </span>
                            ?

                        </p>

                    </div>


                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="
                            p-2
                            rounded-lg
                            text-gray-400
                            hover:bg-gray-100
                            hover:text-gray-600
                            transition
                        "
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* Stars */}

                <div className="mt-7">

                    <p className="text-sm font-medium text-gray-700 text-center mb-3">

                        Select your rating

                    </p>


                    <div className="flex justify-center gap-2">

                        {[1, 2, 3, 4, 5].map((star) => {

                            const active =
                                star <= (hoverRating || rating);


                            return (

                                <button
                                    key={star}
                                    type="button"
                                    disabled={submitting}
                                    onMouseEnter={() =>
                                        setHoverRating(star)
                                    }
                                    onMouseLeave={() =>
                                        setHoverRating(0)
                                    }
                                    onClick={() =>
                                        setRating(star)
                                    }
                                    className="
                                        p-1
                                        transition-transform
                                        hover:scale-110
                                    "
                                >

                                    <Star
                                        size={34}
                                        className={
                                            active
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        }
                                    />

                                </button>

                            );

                        })}

                    </div>


                    <p className="text-center text-sm text-gray-500 mt-2">

                        {rating === 0
                            ? "Tap a star to rate"
                            : `${rating} out of 5`
                        }

                    </p>

                </div>


                {/* Comment */}

                <div className="mt-6">

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Share your experience{" "}

                        <span className="text-gray-400 font-normal">

                            (optional)

                        </span>

                    </label>


                    <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                        maxLength={500}
                        disabled={submitting}
                        placeholder="Tell us about your experience..."
                        className="
                            w-full
                            border border-gray-200
                            rounded-xl
                            px-4 py-3
                            text-sm
                            text-gray-700
                            outline-none
                            focus:border-blue-400
                            focus:ring-2
                            focus:ring-blue-100
                            resize-none
                            transition
                        "
                    />


                    <div className="text-right text-xs text-gray-400 mt-1">

                        {comment.length}/500

                    </div>

                </div>


                {/* Actions */}

                <div className="flex gap-3 mt-6">

                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="
                            flex-1
                            border border-gray-200
                            text-gray-600
                            py-2.5
                            rounded-xl
                            font-medium
                            hover:bg-gray-50
                            transition
                        "
                    >

                        Cancel

                    </button>


                    <button
                        onClick={handleSubmit}
                        disabled={submitting || rating === 0}
                        className="
                            flex-1
                            bg-blue-600
                            hover:bg-blue-700
                            disabled:bg-blue-300
                            disabled:cursor-not-allowed
                            text-white
                            py-2.5
                            rounded-xl
                            font-medium
                            transition
                        "
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Review"
                        }

                    </button>

                </div>

            </div>

        </div>

    );

}


export default RatingModal;