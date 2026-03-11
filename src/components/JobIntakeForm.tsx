import {
  useMemo,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type HTMLInputTypeAttribute,
  type ReactNode,
  type SetStateAction,
} from "react";

const sectionTitles = [
  "Job Type",
  "Customer Details",
  "Address Details",
  "Utility Details",
  "System Details",
  "Installation Details",
  "Schedule & Staff",
  "Logistics",
  "References",
  "Documents",
];

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FileValue = File | File[] | null;

interface FormState {
  jobType: string;
  workType: string;
  ownerType: string;

  firstName: string;
  lastName: string;
  customerFullName: string;
  email: string;
  mobile: string;
  phone: string;
  gstRegistered: string;

  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  fullInstallationAddress: string;
  propertyType: string;
  storyFloorCount: string;

  nmi: string;
  electricityRetailer: string;
  accountHolderName: string;
  billIssueDate: string;
  electricityBill: FileValue;

  solarIncluded: boolean;
  panelManufacturer: string;
  panelModel: string;
  panelQuantity: string;
  panelSystemSize: string;
  inverterIncluded: boolean;
  inverterManufacturer: string;
  inverterSeries: string;
  inverterModel: string;
  inverterQuantity: string;

  batteryIncluded: boolean;
  batteryManufacturer: string;
  batterySeries: string;
  batteryModel: string;
  batteryQuantity: string;
  batteryCapacity: string;

  connectedType: string;
  installationStyle: string;
  batteryInstallationType: string;
  batteryInstallationLocation: string;
  existingSolarRetained: string;
  backupProtectionRequired: string;
  installerPresenceRequired: string;
  specialSiteNotes: string;
  customerInstructions: string;
  sitePreparationNotes: string;

  installationDate: string;
  preferredInstallDate: string;
  installerName: string;
  designerName: string;
  electricianName: string;
  operationsApplicantName: string;
  operationsContact: string;
  operationsEmail: string;

  pickupLocation: string;
  pickupContactPerson: string;
  pickupContactNumber: string;
  pickupHours: string;
  pickupSalesOrderReference: string;
  deliveryWarehouseNotes: string;

  crmId: string;
  poNumber: string;
  orderReference: string;
  proposalNumber: string;
  retailerEntityName: string;
  stcTraderName: string;
  financialPaymentRebateField: string;

  signedProject: FileValue;
  solarProposal: FileValue;
  uploadElectricityBill: FileValue;
  sitePhotos: FileValue;
  supportingDocuments: FileValue;
}

type KeysByType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

type StringFieldKey = KeysByType<FormState, string>;
type BooleanFieldKey = KeysByType<FormState, boolean>;
type FileFieldKey = KeysByType<FormState, FileValue>;
type FormErrors = Partial<Record<StringFieldKey, string>>;

const requiredFieldConfig = [
  { key: "jobType", label: "Job type" },
  { key: "workType", label: "Work type" },
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "streetAddress", label: "Street address" },
  { key: "suburb", label: "Suburb" },
  { key: "state", label: "State" },
  { key: "postcode", label: "Postcode" },
  { key: "nmi", label: "NMI" },
  { key: "electricityRetailer", label: "Electricity retailer" },
] as const satisfies ReadonlyArray<{ key: StringFieldKey; label: string }>;

const requiredFieldKeys = requiredFieldConfig.map((item) => item.key);

const initialForm: FormState = {
  jobType: "Solar PV + Battery",
  workType: "STC Panel",
  ownerType: "Individual",

  firstName: "",
  lastName: "",
  customerFullName: "",
  email: "",
  mobile: "",
  phone: "",
  gstRegistered: "No",

  streetAddress: "",
  suburb: "",
  state: "",
  postcode: "",
  fullInstallationAddress: "",
  propertyType: "Residential",
  storyFloorCount: "",

  nmi: "",
  electricityRetailer: "",
  accountHolderName: "",
  billIssueDate: "",
  electricityBill: null,

  solarIncluded: true,
  panelManufacturer: "",
  panelModel: "",
  panelQuantity: "",
  panelSystemSize: "",
  inverterIncluded: true,
  inverterManufacturer: "",
  inverterSeries: "",
  inverterModel: "",
  inverterQuantity: "",

  batteryIncluded: true,
  batteryManufacturer: "",
  batterySeries: "",
  batteryModel: "",
  batteryQuantity: "",
  batteryCapacity: "",

  connectedType: "On-grid",
  installationStyle: "AC coupling",
  batteryInstallationType: "New",
  batteryInstallationLocation: "",
  existingSolarRetained: "No",
  backupProtectionRequired: "No",
  installerPresenceRequired: "No",
  specialSiteNotes: "",
  customerInstructions: "",
  sitePreparationNotes: "",

  installationDate: "",
  preferredInstallDate: "",
  installerName: "",
  designerName: "",
  electricianName: "",
  operationsApplicantName: "",
  operationsContact: "",
  operationsEmail: "",

  pickupLocation: "",
  pickupContactPerson: "",
  pickupContactNumber: "",
  pickupHours: "",
  pickupSalesOrderReference: "",
  deliveryWarehouseNotes: "",

  crmId: "",
  poNumber: "",
  orderReference: "",
  proposalNumber: "",
  retailerEntityName: "",
  stcTraderName: "",
  financialPaymentRebateField: "",

  signedProject: null,
  solarProposal: null,
  uploadElectricityBill: null,
  sitePhotos: null,
  supportingDocuments: null,
};

const validateRequiredFields = (data: FormState): FormErrors => {
  const nextErrors: FormErrors = {};

  requiredFieldConfig.forEach(({ key, label }) => {
    if (!data[key].trim()) {
      nextErrors[key] = `${label} is required.`;
    }
  });

  return nextErrors;
};

interface LabelProps {
  children: ReactNode;
  required?: boolean;
}

interface InputFieldProps {
  label: string;
  name: StringFieldKey;
  value: string;
  onChange: (event: ChangeEvent<FormElement>) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  wide?: boolean;
  error?: string;
}

interface TextAreaFieldProps {
  label: string;
  name: StringFieldKey;
  value: string;
  onChange: (event: ChangeEvent<FormElement>) => void;
  placeholder?: string;
  wide?: boolean;
}

interface SelectFieldProps {
  label: string;
  name: StringFieldKey;
  value: string;
  onChange: (event: ChangeEvent<FormElement>) => void;
  options?: string[];
  required?: boolean;
  error?: string;
}

interface ToggleFieldProps {
  label: string;
  name: BooleanFieldKey;
  checked: boolean;
  onToggle: (name: BooleanFieldKey) => void;
}

interface FileFieldProps {
  label: string;
  name: FileFieldKey;
  fileName: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  wide?: boolean;
  multiple?: boolean;
}

interface SectionProps {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  currentSection: string;
  setCurrentSection: Dispatch<SetStateAction<string>>;
}

function Label({ children, required = false }: LabelProps) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter value",
  type = "text",
  required = false,
  wide = false,
  error,
}: InputFieldProps) {
  return (
    <div className={wide ? "md:col-span-2 xl:col-span-3" : ""}>
      <Label required={required}>{label}</Label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white ${error ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-slate-400"}`}
      />
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter notes",
  wide = false,
}: TextAreaFieldProps) {
  return (
    <div className={wide ? "md:col-span-2 xl:col-span-3" : ""}>
      <Label>{label}</Label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
}: SelectFieldProps) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white ${error ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-slate-400"}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ToggleField({ label, name, checked, onToggle }: ToggleFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-700">{label}</div>
          <div className="mt-1 text-xs text-slate-500">{checked ? "Enabled" : "Disabled"}</div>
        </div>
        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onToggle(name)}
          className={`relative flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? "bg-slate-900" : "bg-slate-300"}`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
  );
}

function FileField({
  label,
  name,
  fileName,
  onFileChange,
  wide = false,
  multiple = false,
}: FileFieldProps) {
  return (
    <div className={wide ? "md:col-span-2 xl:col-span-3" : ""}>
      <Label>{label}</Label>
      <label className="block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-white">
        <input
          type="file"
          name={name}
          multiple={multiple}
          onChange={onFileChange}
          className="hidden"
        />
        <div className="text-sm font-medium text-slate-700">Click to upload</div>
        <div className="mt-1 text-xs text-slate-500">
          {fileName || (multiple ? "You can upload multiple files" : "No file selected")}
        </div>
      </label>
    </div>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
  currentSection,
  setCurrentSection,
}: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentSection(id)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${currentSection === id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
        >
          {currentSection === id ? "Active" : "Set Active"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

export default function JobIntakeForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentSection, setCurrentSection] = useState("section-1");

  const handleChange = (event: ChangeEvent<FormElement>) => {
    const { name, value } = event.target;
    const fieldName = name as StringFieldKey;

    setForm((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => {
      if (!prev[fieldName] || !value.trim()) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleToggle = (name: BooleanFieldKey) => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files, multiple } = event.target;
    if (!files || files.length === 0) return;
    const fieldName = name as FileFieldKey;

    setForm((prev) => ({
      ...prev,
      [fieldName]: multiple ? Array.from(files) : files[0],
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateRequiredFields(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstMissingField = requiredFieldKeys.find((field) => nextErrors[field]);

      if (firstMissingField) {
        const firstElement = document.querySelector(`[name="${firstMissingField}"]`) as HTMLElement | null;
        if (firstElement) {
          firstElement.scrollIntoView({ behavior: "smooth", block: "center" });
          firstElement.focus();
        }
      }

      alert("Please fill all required fields before submitting.");
      return;
    }

    setErrors({});
    console.log("Submitted payload:", form);
    alert("Form submitted. Check console for payload.");
  };

  const handleSaveDraft = () => {
    console.log("Draft payload:", form);
    alert("Draft saved locally in console.");
  };

  const completedCount = useMemo(() => {
    const fieldsToCheck = [
      form.jobType,
      form.workType,
      form.firstName,
      form.lastName,
      form.email,
      form.mobile,
      form.streetAddress,
      form.suburb,
      form.state,
      form.postcode,
      form.nmi,
      form.electricityRetailer,
      form.installationDate,
    ];

    return fieldsToCheck.filter(Boolean).length;
  }, [form]);

  const progressPercent = Math.min(100, Math.round((completedCount / 13) * 100));

  const getFileName = (value: FileValue) => {
    if (!value) return "";
    if (Array.isArray(value)) return `${value.length} file(s) selected`;
    return value.name || "1 file selected";
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Operations Portal</div>
              <h1 className="mt-2 text-2xl font-bold">Create New Job</h1>
              <p className="mt-2 text-sm text-slate-500">Single master job intake for Solar, Battery, and Aircon, designed to sync to GreenDeal and BridgeSelect.</p>
            </div>

            <div className="space-y-2 text-sm">
              {sectionTitles.map((item, index) => {
                const id = `section-${index + 1}`;
                const active = currentSection === id;
                return (
                  <a
                    key={item}
                    href={`#${id}`}
                    onClick={() => setCurrentSection(id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </a>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-slate-800">Progress</div>
                <div className="text-xs font-semibold text-slate-500">{progressPercent}%</div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{completedCount} important fields completed</p>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm text-white/70">Job Intake Form</p>
                  <h2 className="mt-1 text-3xl font-bold">Solar / Battery / Aircon Submission</h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/80">
                    Capture once, validate once, and prepare one canonical payload for dual submission to GreenDeal and BridgeSelect.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["Record", "Master Intake"],
                    ["Status", "Draft"],
                    ["Destinations", "GreenDeal & BridgeSelect"],
                    ["Sync Mode", "Manual Push"],
                  ].map(([key, value]) => (
                    <div key={key} className="rounded-2xl bg-white/10 p-3   backdrop-blur-sm">
                      <div className="text-xs text-white/60">{key}</div>
                      <div className="mt-2 mr-5 text-sm  font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Section id="section-1" title="1. Job Type" subtitle="High-level job classification shown first for quicker routing." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <SelectField label="Job type" name="jobType" value={form.jobType} onChange={handleChange} required error={errors.jobType} options={["Solar PV + Battery", "Battery Only", "Aircon"]} />
              <SelectField label="Work type" name="workType" value={form.workType} onChange={handleChange} required error={errors.workType} options={["STC Panel", "STC Battery", "STC Panel + STC Battery"]} />
              <SelectField label="Owner type" name="ownerType" value={form.ownerType} onChange={handleChange} options={["Individual", "Company"]} />
            </Section>

            <Section id="section-2" title="2. Customer / Owner Details" subtitle="Primary customer identity and contact details." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <InputField label="First name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ashutosh" required error={errors.firstName} />
              <InputField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Pandey" required error={errors.lastName} />
              <InputField label="Customer full name" name="customerFullName" value={form.customerFullName} onChange={handleChange} placeholder="Ashutosh Pandey" />
              <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="customer@email.com" required error={errors.email} />
              <InputField label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} placeholder="04xx xxx xxx" required error={errors.mobile} />
              <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Optional landline" />
              <SelectField label="Is customer registered for GST?" name="gstRegistered" value={form.gstRegistered} onChange={handleChange} options={["Yes", "No"]} />
            </Section>

            <Section id="section-3" title="3. Installation Address" subtitle="Site address and property information." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <InputField label="Street address" name="streetAddress" value={form.streetAddress} onChange={handleChange} placeholder="123 Example Street" wide required error={errors.streetAddress} />
              <InputField label="Suburb" name="suburb" value={form.suburb} onChange={handleChange} placeholder="Melbourne" required error={errors.suburb} />
              <InputField label="State" name="state" value={form.state} onChange={handleChange} placeholder="VIC" required error={errors.state} />
              <InputField label="Postcode" name="postcode" value={form.postcode} onChange={handleChange} placeholder="3000" required error={errors.postcode} />
              <InputField label="Full installation address" name="fullInstallationAddress" value={form.fullInstallationAddress} onChange={handleChange} placeholder="123 Example Street, Melbourne VIC 3000" wide />
              <SelectField label="Property type" name="propertyType" value={form.propertyType} onChange={handleChange} options={["Residential", "Commercial"]} />
              <InputField label="Story / floor count" name="storyFloorCount" value={form.storyFloorCount} onChange={handleChange} placeholder="2" />
            </Section>

            <Section id="section-4" title="4. Utility / Bill Details" subtitle="Grid and electricity bill information." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <InputField label="NMI" name="nmi" value={form.nmi} onChange={handleChange} placeholder="Enter NMI" required error={errors.nmi} />
              <InputField label="Electricity retailer" name="electricityRetailer" value={form.electricityRetailer} onChange={handleChange} placeholder="AGL / Origin / etc." required error={errors.electricityRetailer} />
              <InputField label="Account holder name" name="accountHolderName" value={form.accountHolderName} onChange={handleChange} placeholder="Same as bill" />
              <InputField label="Bill issue date" name="billIssueDate" type="date" value={form.billIssueDate} onChange={handleChange} />
              <FileField label="Upload electricity bill" name="electricityBill" fileName={getFileName(form.electricityBill)} onFileChange={handleFileChange} wide />
            </Section>

            <Section id="section-5" title="5. System Details" subtitle="Solar, inverter, and battery specifications." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <div className="md:col-span-2 xl:col-span-3">
                <ToggleField label="Solar included" name="solarIncluded" checked={form.solarIncluded} onToggle={handleToggle} />
              </div>

              {form.solarIncluded && (
                <>
                  <InputField label="Panel manufacturer" name="panelManufacturer" value={form.panelManufacturer} onChange={handleChange} placeholder="Jinko" />
                  <InputField label="Panel model" name="panelModel" value={form.panelModel} onChange={handleChange} placeholder="Tiger Neo" />
                  <InputField label="Panel quantity" name="panelQuantity" value={form.panelQuantity} onChange={handleChange} placeholder="24" />
                  <InputField label="Panel system size (kW)" name="panelSystemSize" value={form.panelSystemSize} onChange={handleChange} placeholder="10.56" />
                </>
              )}

              <div className="md:col-span-2 xl:col-span-3">
                <ToggleField label="Inverter included" name="inverterIncluded" checked={form.inverterIncluded} onToggle={handleToggle} />
              </div>

              {form.inverterIncluded && (
                <>
                  <InputField label="Inverter manufacturer" name="inverterManufacturer" value={form.inverterManufacturer} onChange={handleChange} placeholder="GoodWe" />
                  <InputField label="Inverter series" name="inverterSeries" value={form.inverterSeries} onChange={handleChange} placeholder="DNS / ET Series" />
                  <InputField label="Inverter model" name="inverterModel" value={form.inverterModel} onChange={handleChange} placeholder="GW8K" />
                  <InputField label="Inverter quantity" name="inverterQuantity" value={form.inverterQuantity} onChange={handleChange} placeholder="1" />
                </>
              )}

              <div className="md:col-span-2 xl:col-span-3">
                <ToggleField label="Battery included" name="batteryIncluded" checked={form.batteryIncluded} onToggle={handleToggle} />
              </div>

              {form.batteryIncluded && (
                <>
                  <InputField label="Battery manufacturer" name="batteryManufacturer" value={form.batteryManufacturer} onChange={handleChange} placeholder="Tesla" />
                  <InputField label="Battery series" name="batterySeries" value={form.batterySeries} onChange={handleChange} placeholder="Powerwall Series" />
                  <InputField label="Battery model" name="batteryModel" value={form.batteryModel} onChange={handleChange} placeholder="Powerwall 3" />
                  <InputField label="Battery quantity" name="batteryQuantity" value={form.batteryQuantity} onChange={handleChange} placeholder="1" />
                  <InputField label="Battery capacity" name="batteryCapacity" value={form.batteryCapacity} onChange={handleChange} placeholder="13.5 kWh" />
                </>
              )}

            </Section>

            <Section id="section-6" title="6. Installation Details" subtitle="Connection setup, site conditions, and operational notes." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <SelectField label="Connected type" name="connectedType" value={form.connectedType} onChange={handleChange} options={["On-grid", "Off-grid"]} />
              <SelectField label="Installation style" name="installationStyle" value={form.installationStyle} onChange={handleChange} options={["AC coupling", "DC coupling", "Other"]} />
              <SelectField label="Battery installation type" name="batteryInstallationType" value={form.batteryInstallationType} onChange={handleChange} options={["New", "Upgrade"]} />
              <InputField label="Battery installation location" name="batteryInstallationLocation" value={form.batteryInstallationLocation} onChange={handleChange} placeholder="Garage wall" />
              <SelectField label="Existing solar system retained?" name="existingSolarRetained" value={form.existingSolarRetained} onChange={handleChange} options={["Yes", "No"]} />
              <SelectField label="Backup / blackout protection required?" name="backupProtectionRequired" value={form.backupProtectionRequired} onChange={handleChange} options={["Yes", "No"]} />
              <SelectField label="Installer presence required?" name="installerPresenceRequired" value={form.installerPresenceRequired} onChange={handleChange} options={["Yes", "No"]} />
              <TextAreaField label="Special site notes" name="specialSiteNotes" value={form.specialSiteNotes} onChange={handleChange} placeholder="Access issues, roof notes, switchboard notes..." wide />
              <TextAreaField label="Customer instructions" name="customerInstructions" value={form.customerInstructions} onChange={handleChange} placeholder="Special customer preferences..." wide />
              <TextAreaField label="Site preparation notes" name="sitePreparationNotes" value={form.sitePreparationNotes} onChange={handleChange} placeholder="Any preparation required before install..." wide />
            </Section>

            <Section id="section-7" title="7. Schedule / Assignment" subtitle="Dates, team members, and operations contacts." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <InputField label="Installation date" name="installationDate" type="date" value={form.installationDate} onChange={handleChange} />
              <InputField label="Preferred install date" name="preferredInstallDate" type="date" value={form.preferredInstallDate} onChange={handleChange} />
              <InputField label="Installer name" name="installerName" value={form.installerName} onChange={handleChange} placeholder="Assigned installer" />
              <InputField label="Designer name" name="designerName" value={form.designerName} onChange={handleChange} placeholder="Assigned designer" />
              <InputField label="Electrician name" name="electricianName" value={form.electricianName} onChange={handleChange} placeholder="Assigned electrician" />
              <InputField label="Operations applicant name" name="operationsApplicantName" value={form.operationsApplicantName} onChange={handleChange} placeholder="Ops applicant" />
              <InputField label="Operations contact" name="operationsContact" value={form.operationsContact} onChange={handleChange} placeholder="Phone number" />
              <InputField label="Operations email" name="operationsEmail" type="email" value={form.operationsEmail} onChange={handleChange} placeholder="ops@company.com" />
            </Section>

            <Section id="section-8" title="8. Logistics / Pickup Details" subtitle="Warehouse, pickup, and order handling details." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <InputField label="Pickup location" name="pickupLocation" value={form.pickupLocation} onChange={handleChange} placeholder="Warehouse / Supplier address" />
              <InputField label="Pickup contact person" name="pickupContactPerson" value={form.pickupContactPerson} onChange={handleChange} placeholder="Contact name" />
              <InputField label="Pickup contact number" name="pickupContactNumber" value={form.pickupContactNumber} onChange={handleChange} placeholder="04xx xxx xxx" />
              <InputField label="Pickup hours" name="pickupHours" value={form.pickupHours} onChange={handleChange} placeholder="9 AM - 5 PM" />
              <InputField label="Pickup sales order reference" name="pickupSalesOrderReference" value={form.pickupSalesOrderReference} onChange={handleChange} placeholder="SO-12345" />
              <TextAreaField label="Delivery / warehouse notes" name="deliveryWarehouseNotes" value={form.deliveryWarehouseNotes} onChange={handleChange} placeholder="Any logistics or handling notes..." wide />
            </Section>

            <Section id="section-9" title="9. References / Internal Fields" subtitle="Internal identifiers for CRM, proposals, and payment tracking." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <InputField label="CRM ID" name="crmId" value={form.crmId} onChange={handleChange} placeholder="CRM-001" />
              <InputField label="PO number" name="poNumber" value={form.poNumber} onChange={handleChange} placeholder="PO-001" />
              <InputField label="Order reference" name="orderReference" value={form.orderReference} onChange={handleChange} placeholder="REF-001" />
              <InputField label="Proposal number / signed project ID" name="proposalNumber" value={form.proposalNumber} onChange={handleChange} placeholder="PROP-001" />
              <InputField label="Retailer entity name" name="retailerEntityName" value={form.retailerEntityName} onChange={handleChange} placeholder="Entity name" />
              <InputField label="STC trader name" name="stcTraderName" value={form.stcTraderName} onChange={handleChange} placeholder="Trader name" />
              <InputField label="Financial payment / rebate field" name="financialPaymentRebateField" value={form.financialPaymentRebateField} onChange={handleChange} placeholder="Rebate / finance details" />
            </Section>

            <Section id="section-10" title="10. Document Uploads" subtitle="Centralized supporting documents." currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <FileField label="Upload signed project" name="signedProject" fileName={getFileName(form.signedProject)} onFileChange={handleFileChange} />
              <FileField label="Upload solar proposal" name="solarProposal" fileName={getFileName(form.solarProposal)} onFileChange={handleFileChange} />
              <FileField label="Upload electricity bill" name="uploadElectricityBill" fileName={getFileName(form.uploadElectricityBill)} onFileChange={handleFileChange} />
              <FileField label="Upload site photos" name="sitePhotos" fileName={getFileName(form.sitePhotos)} onFileChange={handleFileChange} multiple />
              <FileField label="Upload supporting documents" name="supportingDocuments" fileName={getFileName(form.supportingDocuments)} onFileChange={handleFileChange} wide multiple />
            </Section>

            <div className="sticky bottom-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Ready for implementation</div>
                <div className="text-sm text-slate-500">This is now actual usable React code with form state and handlers.</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
                >
                  Submit Job
                </button>
              </div>
            </div>
          </main>
        </form>
      </div>
    </div>
  );
}
