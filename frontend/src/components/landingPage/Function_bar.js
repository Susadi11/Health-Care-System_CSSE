import { Link } from "react-router-dom";
import { GiStethoscope } from "react-icons/gi";
import { GiMedicalDrip } from "react-icons/gi";
import { GiHeartPlus } from "react-icons/gi";
import { GiMedicines } from "react-icons/gi";

const features = [
    { name: 'General Checkups', description: 'Routine health assessments to keep you in check.', icon: <GiStethoscope /> },
    { name: 'Specialist Consultations', description: 'Access experienced specialists for tailored care.', icon: <GiMedicalDrip /> },
    { name: 'Heart Care', description: 'Comprehensive heart health management and treatment.', icon: <GiHeartPlus /> },
    { name: 'Medication Delivery', description: 'Get your prescribed medications delivered to your door.', icon: <GiMedicines /> },
];

export default function Function_bar() {
    return (
        <div className="bg-slate-100">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 px-4 py-8 sm:px-6 sm:py-16 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                <div className="gap-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Health Services</h2>
                    <p className="mt-6 text-gray-700">
                        We offer a wide range of health services, from routine checkups to specialist consultations.
                        Our goal is to provide comprehensive care with convenience and accessibility.
                    </p>
                    <div className="pt-8">
                        <Link to="/bookAppointment" className="my-8 flex-none rounded-full bg-gray-900 px-6 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700">
                            Book an Appointment <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>
                <div>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 sm:gap-y-4 lg:gap-x-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="border-t border-gray-300 pt-4 group">
                                <div className="flex flex-row gap-2 items-center">
                                    <div>
                                        {feature.icon}
                                    </div>
                                    <dt className="font-medium text-gray-900 group-hover:cursor-pointer">
                                        {feature.name} <span aria-hidden="true"
                                                             className="invisible group-hover:visible transition-opacity duration-300">&rarr;</span>
                                    </dt>
                                </div>

                                <dd className="mt-2 text-sm text-gray-700">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
