import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const themes = ['Light', 'Dark', 'Colorful'];

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    bio: '',
    socialLinks: [{ platform: '', url: '' }], // Initialize with one empty object
    theme: themes[0],
    username: '',
    upiId: '',
    walletAmount: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialLinkChange = (index, e) => {
    const { name, value } = e.target;
    const newLinks = formData.socialLinks.map((link, i) =>
      i === index ? { ...link, [name]: value } : link
    );
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const addSocialLink = () => {
    setFormData({ ...formData, socialLinks: [...formData.socialLinks, { platform: '', url: '' }] });
  };

  const removeSocialLink = (index) => {
    const newLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', formData);

      if (response.status === 200) {
        // Redirect to the protected page or dashboard after successful signup
        router.push('/login?msg=Thanks+for+signing+up,+please+login+to+proceed');
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      setError(error.response.data.error);
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 py-2 rounded">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}
      {step === 1 && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 outline-none border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border outline-none border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="bg-[#ed5a6b] text-white px-3 py-2 rounded hover:bg-[#f68e7e]">Next</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 outline-none border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bio (optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 outline-none border border-gray-300 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Social Links (optional)</label>
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    name="platform"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, e)}
                    placeholder="Platform"
                    className="w-1/2 p-2 outline-none border border-gray-300 rounded mr-2"
                  />
                  <input
                    type="text"
                    name="url"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, e)}
                    placeholder="URL"
                    className="w-1/2 p-2 outline-none border border-gray-300 rounded mr-2"
                  />
                  <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500">Remove</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addSocialLink} className="text-[#ed5a6b]">+ Add another link</button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full p-2 border outline-none border-gray-300 rounded mt-1"
              required
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="bg-gray-500 text-white px-3 py-2 transition-all duration-100 rounded hover:bg-gray-600">Back</button>
            <button type="button" onClick={() => setStep(3)} className="bg-[#ed5a6b] text-white px-3 py-2 rounded transition-all duration-100 hover:bg-[#f68e7e]">Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 outline-none border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              className="w-full p-2 outline-none border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">Back</button>
            <button type="submit" className="bg-[#ed5a6b] text-white px-3 py-2 rounded hover:bg-[#f68e7e]">Sign up</button>
          </div>
        </>
      )}
    </form>
  );
};

export default SignupForm;
