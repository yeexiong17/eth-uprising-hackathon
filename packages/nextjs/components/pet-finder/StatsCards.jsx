import petData from "../../data/petData.json";

export const StatsCards = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-red-500 text-4xl mb-2">🔴</div>
                    <p className="text-2xl font-bold text-red-500 mb-1">
                        {petData.pets.filter(p => p.status === "Lost").length}
                    </p>
                    <p className="text-gray-600 font-medium">Lost Pets</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-green-500 text-4xl mb-2">🟢</div>
                    <p className="text-2xl font-bold text-green-500 mb-1">
                        {petData.pets.filter(p => p.status === "Found").length}
                    </p>
                    <p className="text-gray-600 font-medium">Found Pets</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-blue-500 text-4xl mb-2">🐾</div>
                    <p className="text-2xl font-bold text-blue-500 mb-1">
                        {petData.pets.length}
                    </p>
                    <p className="text-gray-600 font-medium">Total Reports</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-purple-500 text-4xl mb-2">⚡</div>
                    <p className="text-2xl font-bold text-purple-500 mb-1">24/7</p>
                    <p className="text-gray-600 font-medium">Active Support</p>
                </div>
            </div>
        </div>
    );
}; 