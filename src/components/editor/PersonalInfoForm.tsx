import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';

export function PersonalInfoForm() {
  const { resume, setPersonalInfo } = useResumeStore();
  const { personalInfo } = resume;

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo({ [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Let's start with your basic contact information
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name
          </label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="input-field w-full"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="input-field w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="input-field w-full"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Location
          </label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="input-field w-full"
          />
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-4 text-muted-foreground">
            Social Profiles (Optional)
          </h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-muted-foreground" />
                LinkedIn
              </label>
              <input
                type="url"
                value={personalInfo.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
                className="input-field w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Github className="w-4 h-4 text-muted-foreground" />
                GitHub
              </label>
              <input
                type="url"
                value={personalInfo.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="github.com/johndoe"
                className="input-field w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Portfolio
              </label>
              <input
                type="url"
                value={personalInfo.portfolio || ''}
                onChange={(e) => handleChange('portfolio', e.target.value)}
                placeholder="johndoe.com"
                className="input-field w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
