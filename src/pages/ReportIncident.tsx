import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../hooks/useIncidents';
import { useAuth } from '../utils/authUtils';
import { useNotifications } from '../utils/notificationUtils';

interface FormData {
  title: string;
  description: string;
  category: 'it' | 'hr' | 'security' | 'facilities' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  tags: string[];
  attachments: File[];
}

const initialFormData: FormData = {
  title: '',
  description: '',
  category: 'it',
  priority: 'medium',
  location: '',
  tags: [],
  attachments: []
};

const categories = [
  { value: 'it', label: 'Information Technology', icon: '💻' },
  { value: 'hr', label: 'Human Resources', icon: '👥' },
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'facilities', label: 'Facilities', icon: '🏢' },
  { value: 'other', label: 'Other', icon: '📋' }
];

const priorities = [
  { value: 'low', label: 'Low', description: 'Minor issues that can wait' },
  { value: 'medium', label: 'Medium', description: 'Standard priority issues' },
  { value: 'high', label: 'High', description: 'Important issues requiring attention' },
  { value: 'critical', label: 'Critical', description: 'Urgent issues requiring immediate attention' }
];

export function ReportIncident() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();
  const { createIncident } = useIncidents();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const handleInputChange = (field: keyof FormData, value: string | string[] | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      await createIncident({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'open',
        reportedBy: user,
        tags: formData.tags,
        attachments: formData.attachments.map(file => file.name),
        location: formData.location
      });

      addNotification({
        type: 'incident_created',
        title: 'Incident Reported',
        message: `Your incident "${formData.title}" has been successfully reported`
      });

      navigate('/incidents');
    } catch (error) {
      console.error('Error creating incident:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.title && formData.description && formData.category;
  const isStep2Valid = formData.priority;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Report New Incident</h1>
        <p className="text-slate-600">
          Provide detailed information about the incident to help us resolve it quickly
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={currentStep >= 1 ? 'text-blue-600' : 'text-slate-500'}>
            Basic Information
          </span>
          <span className={currentStep >= 2 ? 'text-blue-600' : 'text-slate-500'}>
            Priority & Details
          </span>
          <span className={currentStep >= 3 ? 'text-blue-600' : 'text-slate-500'}>
            Review & Submit
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-6"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief, descriptive title for the incident"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <motion.label
                    key={category.value}
                    whileHover={{ scale: 1.02 }}
                    className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.category === category.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={(e) => handleInputChange('category', e.target.value as FormData['category'])}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <span className="font-medium text-slate-900">{category.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide detailed information about the incident, including what happened, when it occurred, and any relevant context..."
                required
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(2)}
                disabled={!isStep1Valid}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isStep1Valid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next Step
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Priority & Details */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-6"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Priority & Additional Details</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">
                Priority Level *
              </label>
              <div className="space-y-3">
                {priorities.map((priority) => (
                  <motion.label
                    key={priority.value}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.priority === priority.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={(e) => handleInputChange('priority', e.target.value as FormData['priority'])}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <p className="font-medium text-slate-900">{priority.label}</p>
                      <p className="text-sm text-slate-600">{priority.description}</p>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Building, floor, room number, or specific location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add tags to categorize this incident"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Add
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Previous
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(3)}
                disabled={!isStep2Valid}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isStep2Valid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Review
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-6"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Review & Submit</h2>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">Incident Summary</h3>
                <p className="text-lg font-semibold text-slate-900">{formData.title}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formData.category.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    formData.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    formData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {formData.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">Description</h3>
                <p className="text-slate-700">{formData.description}</p>
              </div>

              {formData.location && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-2">Location</h3>
                  <p className="text-slate-700">{formData.location}</p>
                </div>
              )}

              {formData.tags.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Previous
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Incident'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}