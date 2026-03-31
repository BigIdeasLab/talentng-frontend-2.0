'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentUploader } from './DocumentUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ResponsiveFormField } from '@/components/forms/ResponsiveFormField';
import { ResponsiveFormButtons } from '@/components/forms/ResponsiveFormButtons';
import type { BusinessVerificationData, DocumentUploadResponse } from '@/lib/api/verification';

// Validation Schemas
export const businessInfoSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  businessType: z.string().min(1, 'Business type is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const contactInfoSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9][\d\s]{1,17}$/, 'Invalid phone number format'),
});

export const documentSchema = z.object({
  documents: z.array(z.instanceof(File)).min(1, 'At least one document is required'),
});

export const fullVerificationSchema = businessInfoSchema
  .merge(contactInfoSchema)
  .merge(documentSchema);

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;
type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;
type DocumentFormValues = z.infer<typeof documentSchema>;
type FullVerificationFormValues = z.infer<typeof fullVerificationSchema>;

interface ApplicationFormProps {
  initialData?: Partial<BusinessVerificationData>;
  onSubmit: (data: BusinessVerificationData) => Promise<void>;
  isSubmitting: boolean;
}

const BUSINESS_TYPES = [
  'LLC',
  'Corporation',
  'Partnership',
  'Sole Proprietorship',
  'Other',
];

const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United States',
  'United Kingdom',
  'Other',
];

export function ApplicationForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessVerificationData>>(
    initialData || {}
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Step 1: Business Info Form
  const businessInfoForm = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: initialData?.businessName || '',
      registrationNumber: initialData?.registrationNumber || '',
      businessType: initialData?.businessType || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || '',
      website: initialData?.website || '',
    },
  });

  // Step 2: Contact Info Form
  const contactInfoForm = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phoneNumber: initialData?.phoneNumber || '',
    },
  });

  // Step 3: Document Form
  const documentForm = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documents: initialData?.documents || [],
    },
  });

  const handleBusinessInfoNext = (data: BusinessInfoFormValues) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleContactInfoNext = (data: ContactInfoFormValues) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleDocumentUpload = async (file: File): Promise<DocumentUploadResponse> => {
    // Store the actual file object
    setUploadedFiles((prev) => [...prev, file]);
    
    // Update form data with files
    documentForm.setValue('documents', [...uploadedFiles, file]);
    
    // Return a mock response for UI display
    return {
      documentId: `file-${Date.now()}`,
      url: URL.createObjectURL(file),
      filename: file.name,
    };
  };

  const handleDocumentRemove = (documentId: string) => {
    // Extract index from documentId (format: file-timestamp)
    const index = uploadedFiles.findIndex((_, i) => `file-${i}` === documentId);
    
    if (index !== -1) {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      documentForm.setValue('documents', newFiles);
    }
  };

  const handleFinalSubmit = async (data: DocumentFormValues) => {
    const fullData: BusinessVerificationData = {
      ...formData,
      ...data,
    } as BusinessVerificationData;

    await onSubmit(fullData);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of 3
          </span>
          <span className="text-sm text-gray-500">
            {currentStep === 1 && 'Business Information'}
            {currentStep === 2 && 'Contact Details'}
            {currentStep === 3 && 'Document Upload'}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Step ${currentStep} of 3`}
          />
        </div>
      </div>

      {/* Step 1: Business Information */}
      {currentStep === 1 && (
        <Form {...businessInfoForm}>
          <form
            onSubmit={businessInfoForm.handleSubmit(handleBusinessInfoNext)}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Business Information
            </h2>

            <ResponsiveFormField fullWidth>
              <label className="text-sm font-medium text-gray-700">
                Business Name <span className="text-red-500">*</span>
              </label>
              <FormField
                control={businessInfoForm.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your business name"
                        {...field}
                        className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                        aria-label="Business name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ResponsiveFormField>

            <ResponsiveFormField fullWidth>
              <label className="text-sm font-medium text-gray-700">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <FormField
                control={businessInfoForm.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter registration number"
                        {...field}
                        className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                        aria-label="Registration number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ResponsiveFormField>

            <ResponsiveFormField fullWidth>
              <label className="text-sm font-medium text-gray-700">
                Business Type <span className="text-red-500">*</span>
              </label>
              <FormField
                control={businessInfoForm.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-12 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        aria-label="Business type"
                      >
                        <option value="">Select business type</option>
                        {BUSINESS_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ResponsiveFormField>

            <ResponsiveFormField fullWidth>
              <label className="text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <FormField
                control={businessInfoForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter business address"
                        {...field}
                        className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                        aria-label="Business address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ResponsiveFormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveFormField fullWidth>
                <label className="text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <FormField
                  control={businessInfoForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter city"
                          {...field}
                          className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                          aria-label="City"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ResponsiveFormField>

              <ResponsiveFormField fullWidth>
                <label className="text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <FormField
                  control={businessInfoForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter state"
                          {...field}
                          className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                          aria-label="State"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ResponsiveFormField>
            </div>

            <ResponsiveFormField fullWidth>
              <label className="text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <FormField
                control={businessInfoForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-12 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        aria-label="Country"
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ResponsiveFormField>

            <ResponsiveFormField fullWidth>
              <label className="text-sm font-medium text-gray-700">
                Website (Optional)
              </label>
              <FormField
                control={businessInfoForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                        className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                        aria-label="Website"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ResponsiveFormField>

            <ResponsiveFormButtons align="end" className="mt-6">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 rounded-lg"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </ResponsiveFormButtons>
          </form>
        </Form>
      )}

      {/* Step 2: Contact Details */}
      {currentStep === 2 && (
        <Form {...contactInfoForm}>
          <form
            onSubmit={contactInfoForm.handleSubmit(handleContactInfoNext)}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Details
            </h2>

            <ResponsiveFormField fullWidth>
              <label className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <FormField
                control={contactInfoForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1234567890"
                        {...field}
                        className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-600"
                        aria-label="Phone number"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code (e.g., +234 for Nigeria)
                    </p>
                  </FormItem>
                )}
              />
            </ResponsiveFormField>

            <ResponsiveFormButtons align="between" className="mt-6">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="px-8 h-12 rounded-lg"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 rounded-lg"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </ResponsiveFormButtons>
          </form>
        </Form>
      )}

      {/* Step 3: Document Upload */}
      {currentStep === 3 && (
        <Form {...documentForm}>
          <form
            onSubmit={documentForm.handleSubmit(handleFinalSubmit)}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Document Upload
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Upload verification documents such as business registration certificate,
              tax identification, or other official documents.
            </p>

            <FormField
              control={documentForm.control}
              name="documents"
              render={() => (
                <FormItem>
                  <FormControl>
                    <DocumentUploader
                      onUpload={handleDocumentUpload}
                      onRemove={handleDocumentRemove}
                      documents={uploadedFiles.map((file, index) => ({
                        documentId: `file-${index}`,
                        url: URL.createObjectURL(file),
                        filename: file.name,
                      }))}
                      maxFiles={5}
                      maxSizeMB={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ResponsiveFormButtons align="between" className="mt-6">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="px-8 h-12 rounded-lg"
                disabled={isSubmitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || uploadedFiles.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </ResponsiveFormButtons>
          </form>
        </Form>
      )}
    </div>
  );
}
