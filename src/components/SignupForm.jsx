import axios from 'axios';
import { useState } from 'react';

const themes = ['Light', 'Dark', 'Colorful'];

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    bio: '',
    socialLinks: [{ platform: '', url: '' }], // Initialize with one empty object
    theme: themes[0],
    username: '',
    upiId: ''
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
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
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
              className="w-full p-2 border border-gray-300 rounded mt-1"
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
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Next</button>
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
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bio (optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
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
                    className="w-1/2 p-2 border border-gray-300 rounded mr-2"
                  />
                  <input
                    type="text"
                    name="url"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, e)}
                    placeholder="URL"
                    className="w-1/2 p-2 border border-gray-300 rounded mr-2"
                  />
                  <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500">Remove</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addSocialLink} className="text-blue-500">+ Add another link</button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Theme</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Back</button>
            <button type="button" onClick={() => setStep(3)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Next</button>
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
              className="w-full p-2 border border-gray-300 rounded mt-1"
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
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Back</button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
          </div>
        </>
      )}
    </form>
  );
};

export default SignupForm;
