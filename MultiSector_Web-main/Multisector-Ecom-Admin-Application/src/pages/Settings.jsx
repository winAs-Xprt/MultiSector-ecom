import Layout from '../components/Layout';

const Settings = () => {
  return (
    <Layout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Configure your application settings
        </p>
      </div>

      {/* Settings Content - Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-shadow duration-300">
        <p className="text-gray-600 text-center py-8">
          Settings content will be displayed here
        </p>
      </div>
    </Layout>
  );
};

export default Settings;
