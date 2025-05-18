# User’s Manual for AmigosFitnessGym

## 1. Introduction

*   **Purpose of the System:**
    AmigosFitnessGym is a comprehensive web application designed to streamline fitness center operations. It allows users (Clients/Members) to browse available services and classes, view detailed trainer profiles, book appointments for personal training or classes, and manage their memberships. For Administrators, the system provides tools to manage trainers, oversee all client appointments, create and update pricing plans, and manage overall system content and settings.

*   **Intended Audience:**
    This manual is for all users of the AmigosFitnessGym system, including:
    *   **Clients/Members:** Individuals using the system to explore gym offerings, book sessions, and manage their fitness journey with AmigosFitnessGym.
    *   **Administrators:** Staff responsible for the day-to-day management of the gym’s digital presence, including services, trainer information, client bookings, membership plans, and system configurations.

*   **System Requirements:**
    *   **OS:** Windows 10 or later, macOS 10.15 (Catalina) or later, or any modern Linux distribution.
    *   **Browser:** Latest stable versions of Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge.
    *   **Internet:** A stable and consistent internet connection is required for accessing and using all features of the system.

## 2. Getting Started

*   **Accessing the System:**
    The AmigosFitnessGym system is accessible via a web browser.
    *   **URL:** `https://amigosfitnessgym.netlify.app/` (Note: This is a placeholder. Please use the actual deployed URL.)
    *   To begin, open your preferred web browser and navigate to the URL provided above. This will take you to the main landing page, which includes options for login and registration.

*   **Account Registration/Login:**

    **For New Clients/Members (Registration):**
    1.  Navigate to the system URL.
    2.  Locate and click on the "Sign Up," "Register," or "Create Account" button, typically found in the navigation bar or main page.
    3.  You will be prompted to fill in a registration form. Required details usually include:
        *   Full Name
        *   Email Address (this will be your username)
        *   Password (choose a strong, unique password)
        *   (Potentially other details like phone number or date of birth)
    4.  Review and agree to the Terms and Conditions and Privacy Policy.
    5.  Click the "Submit," "Register," or "Create Account" button to complete your registration.
    6.  A verification email may be sent to your registered email address. Click the verification link in the email to activate your account.

    **For Existing Users (Login - Clients/Members & Administrators):**
    1.  Navigate to the system URL `https://amigosfitnessgym.netlify.app/admin/login`.
    2.  Click on the "Login" or "Sign In" button.
    3.  Enter your registered Email Address and Password in the respective fields.
        *   Administrators will use their specific admin credentials, potentially via the same login page or a designated admin login link if provided (`/admin/login` or similar).
    4.  Click the "Login" or "Sign In" button to access your account.

*   **User Roles & Permissions:**

    *   **Client/Member:**
        *   **Profile Management:** View and update personal profile information (e.g., name, contact details). Change account password.
        *   **Browse Services & Classes:** View detailed descriptions of all fitness services, classes (e.g., Yoga, Zumba, Boxing, Circuit Training, Strength & Conditioning), and special programs offered.
        *   **View Trainer Profiles:** Access profiles of available trainers, including their specializations, experience, and possibly photos.
        *   **Appointment Booking:** Book, view, and manage (e.g., reschedule or cancel, subject to policy) appointments for personal training or group classes.
        *   **Membership Management:** View current membership plan details, and potentially upgrade or renew memberships.
        *   **Access Informational Pages:** View pages like "About Us," "FAQs," and "Contact."

    *   **Administrator:**
        *   **All Client/Member Permissions:** Can perform all actions available to a regular client/member.
        *   **Admin Dashboard Access:** Access a dedicated dashboard with overview statistics and quick links to management sections.
        *   **Trainer Management:** Add new trainer profiles (including name, specialization, bio, photo via `uploads/trainers/`), edit existing trainer details, and remove trainer profiles.
        *   **Appointment Management:** View all client appointments, filter by date/trainer/client, approve, reschedule, or cancel bookings.
        *   **Pricing & Plan Management:** Create new membership plans and pricing packages, edit existing plan details (name, price, duration, features), and delete plans.
        *   **Client/User Management (Implied):** View list of registered users, potentially manage their status or details.
        *   **Content Management (Implied):** Update content on static pages like "About Us," "FAQs," or gym announcements.
        *   **View System Reports/Analytics (Potential):** Access reports on bookings, revenue, member activity, etc. (if implemented).

## 3. System Features

### 3.1 Dashboard
*   **Client/Member Dashboard:**
    *   **Overview:** Upon successful login, clients are typically directed to their personal dashboard.
    *   **Content:** This area usually provides a quick summary of upcoming booked appointments, recent activity, links to frequently used features like "Book a Class" or "View Trainers," and any important gym announcements or notifications.
*   **Administrator Dashboard (`Frontend/src/pages/Admin/AdminDashboard.jsx`):**
    *   **Overview:** A centralized control panel for administrators.
    *   **Content:** Displays key metrics (e.g., total members, upcoming appointments, new bookings), quick navigation links to management sections such as "Trainer Management," "Appointments Management," "Pricing Management," and "User Management."

### 3.2 User Profile Management
*   **What it does:** Allows users to manage their personal account information and security settings.
*   **Editing Profile Information (Client/Member & Admin):**
    1.  Log in to your account.
    2.  Navigate to the "My Profile," "Account," or "Settings" section (often accessible via a user icon or dropdown menu in the navigation bar).
    3.  Select the option to "Edit Profile."
    4.  Update fields such as your name, contact number, or address as needed.
    5.  Click "Save Changes" or "Update Profile" to apply the modifications.
*   **Changing Password (Client/Member & Admin):**
    1.  Access the "My Profile" or "Account Settings" section.
    2.  Look for a "Change Password" or "Security" option.
    3.  You will typically be required to enter your current password for verification.
    4.  Enter your new desired password.
    5.  Confirm the new password by re-typing it.
    6.  Click "Update Password" or "Save Changes."

### 3.3 Services & Classes (`Frontend/src/pages/Services.jsx`)
*   **What it does:** This feature allows all users (guests and logged-in members) to explore the range of fitness services and group classes offered by AmigosFitnessGym. This includes viewing details like class descriptions, benefits, and suitability.
*   **How to use it:**
    1.  Navigate to the "Services," "Classes," or "Programs" section from the main website menu.
    2.  Browse the categorized list of available offerings (e.g., Athletic Training, Body Toning, Boxing Class, Circuit Training, Dynamic Functional Training, Muay Thai, Running Clinic, Strength and Conditioning, Tabata, Weight Loss/Gain, Yoga, Zumba - inferred from `Frontend/public/assets/images/`).
    3.  Click on a specific service or class name/image to view a more detailed page. This page may include:
        *   In-depth description.
        *   Schedule/Timetable (if not directly bookable from here).
        *   Duration of the class/session.
        *   Trainer(s) who conduct the class.
        *   Any prerequisites or equipment needed.

### 3.4 Trainer Profiles (`Frontend/src/pages/Trainers.jsx`, `Frontend/src/components/trainercomponents/TrainerCard.jsx`)
*   **What it does:** Provides users with the ability to view detailed profiles of the fitness trainers working at AmigosFitnessGym. This helps clients choose trainers that best fit their fitness goals and preferences.
*   **How to use it:**
    1.  Navigate to the "Trainers," "Our Team," or a similarly named section from the main menu.
    2.  A list or grid of trainer cards will be displayed, showing a brief overview (e.g., name, photo, specialization).
    3.  Click on a specific trainer's card or "View Profile" button.
    4.  The detailed trainer profile page will display:
        *   Trainer's full name and photograph (`backend/uploads/trainers/`).
        *   Biography and professional experience.
        *   Areas of specialization or certifications.
        *   Potentially their availability or the classes they lead.
        *   (If implemented) Client testimonials or ratings.

### 3.5 Appointment Booking (`Frontend/src/components/Appointment.jsx`, `backend/controllers/appointmentController.js`)
*   **What it does:** This core feature enables logged-in Clients/Members to schedule personal training sessions or reserve spots in group fitness classes.
*   **How to use it (Step-by-step):**
    1.  Ensure you are logged into your AmigosFitnessGym account.
    2.  Navigate to the "Book Appointment," "Schedule," or "Book a Class" section. This might also be accessible directly from a service or trainer's profile.
    3.  Select the desired service (e.g., "Personal Training," "Yoga Class") or the specific trainer you wish to book with.
    4.  An interactive calendar or list of available time slots will be displayed.
    5.  Choose your preferred date and time.
    6.  Review the booking details (service, trainer, date, time, duration, price if applicable).
    7.  Click "Confirm Booking," "Book Now," or a similar button to finalize the appointment.
    8.  You should receive an on-screen confirmation message and often an email confirmation with the appointment details.
    9.  Booked appointments can typically be viewed and managed in a "My Appointments" or "My Schedule" section of your user profile.

### 3.6 Pricing & Membership Plans (`Frontend/src/pages/Pricing.jsx`, `Frontend/src/components/PricingComponent.jsx`, `backend/controllers/pricingController.js`)
*   **What it does:** This section displays the various membership plans, packages, and their associated costs, benefits, and durations, allowing users to choose and subscribe to a plan that suits their needs.
*   **How to use it:**
    1.  Navigate to the "Pricing," "Membership," or "Plans" section from the main website menu.
    2.  You will see a list or comparison of different membership plans offered (e.g., "Basic Monthly," "Premium Annual," "Class Packs").
    3.  Each plan will detail:
        *   Name of the plan.
        *   Price.
        *   Duration (e.g., 1 month, 3 months, 1 year).
        *   Included benefits (e.g., unlimited gym access, number of personal training sessions, access to all classes).
        *   Any specific terms or conditions.
    4.  Click on a "Select Plan," "Subscribe," or "Join Now" button for the desired plan.
    5.  You may be redirected to a payment gateway or a form to enter payment details to complete the subscription.
    6.  Upon successful payment, your membership will be activated, and details will be reflected in your user profile.

### 3.7 Trainer Management (Administrator Only - `Frontend/src/components/trainercomponents/TrainerForm.jsx`, `backend/controllers/trainerController.js`)
*   **What it does:** Allows administrators to add new trainers to the system, update information for existing trainers, and manage their active status or profiles. Trainer photos are managed via `backend/uploads/trainers/`.
*   **How to use it (Adding a New Trainer):**
    1.  Log in with Administrator credentials.
    2.  Navigate to the Admin Dashboard.
    3.  Select "Trainer Management" or a similar option (e.g., from a sidebar or main admin menu).
    4.  Click on an "Add New Trainer" or "+" button.
    5.  A form (`TrainerForm.jsx`) will appear. Fill in the required details:
        *   Trainer's Full Name
        *   Specialization(s) (e.g., Yoga, Strength Training, Boxing)
        *   Biography/Experience
        *   Contact Information (optional, for internal use)
        *   Upload a Profile Picture (system will store this in `backend/uploads/trainers/`)
        *   Set availability or assign to specific services/classes.
    6.  Click "Save Trainer" or "Add Trainer." The new trainer profile will now be visible on the public "Trainers" page and available for booking if applicable.
    *   **Editing/Deleting a Trainer:** From the trainer list in the admin panel, select a trainer and choose "Edit" to modify details or "Delete" to remove their profile.

### 3.8 Appointment Management (Administrator Only - `Frontend/src/pages/Admin/AppointmentsManagement.jsx`, `backend/controllers/appointmentController.js`)
*   **What it does:** Provides administrators with a comprehensive view of all booked appointments (both personal training and classes). They can manage these bookings, view schedules, and assist clients if needed.
*   **How to use it:**
    1.  Log in as an Administrator.
    2.  Access the Admin Dashboard.
    3.  Navigate to "Appointment Management" or "Bookings."
    4.  The system will display a list or calendar view of all appointments.
    5.  Utilize filters to sort/view appointments by:
        *   Date range
        *   Specific Trainer
        *   Specific Client/Member
        *   Service/Class type
        *   Booking status (e.g., Confirmed, Cancelled, Completed)
    6.  Click on an individual appointment to view its full details.
    7.  From here, administrators can typically:
        *   Confirm pending bookings (if an approval process is in place).
        *   Reschedule an appointment (after coordinating with the client/trainer).
        *   Cancel an appointment.
        *   Mark an appointment as "Completed."

### 3.9 Pricing Management (Administrator Only - `Frontend/src/pages/Admin/PricingManagement.jsx`, `Frontend/src/components/pricingmanagecomponents/PlanFormModal.jsx`, `backend/controllers/pricingController.js`)
*   **What it does:** Enables administrators to define, create, edit, and remove the various membership plans and pricing packages offered by AmigosFitnessGym.
*   **How to use it (Creating a New Pricing Plan):**
    1.  Log in with Administrator credentials.
    2.  Go to the Admin Dashboard.
    3.  Select "Pricing Management" or "Membership Plans."
    4.  Click on "Create New Plan," "Add Plan," or a similar button.
    5.  A form or modal (`PlanFormModal.jsx`) will appear. Enter the details for the new plan:
        *   Plan Name (e.g., "Gold Monthly," "Student Special")
        *   Description (detailing what the plan includes)
        *   Price
        *   Duration (e.g., 1 month, 6 months, 1 year, or number of sessions for a class pack)
        *   Specific features or benefits (e.g., "Unlimited gym access," "5 group classes per month," "1 personal training session included")
        *   Set as "Active" or "Inactive."
    6.  Click "Save Plan" or "Create Plan." The new plan will now be visible on the public "Pricing" page for clients to subscribe to.
    *   **Editing/Deleting a Plan:** From the list of plans in the admin panel, select a plan and choose "Edit" to modify its details or "Delete" to remove it (ensure no active subscribers are on a plan before deletion, or handle appropriately).

## 4. How-To Guides

*   **How a Client Books a Personal Training Session:**
    1.  Navigate to the "Trainers" page from the main menu on the AmigosFitnessGym website.
    2.  Browse the list of trainers and click on the profile of the trainer you're interested in.
    3.  On the trainer's profile, look for a "Book Session" or "Check Availability" button.
    4.  Alternatively, go to the "Book Appointment" page, select "Personal Training," and then choose your desired trainer.
    5.  A calendar will display the trainer's available dates and time slots. Select your preferred date and time.
    6.  Review the booking summary (trainer, date, time, duration, price). You will likely be asked to provide your name, email, and other contact details at this stage to complete the booking and receive confirmation.
    7.  Click "Confirm Booking." You will receive an on-screen confirmation and an email with your booking details.
    *(Visual: Ideally, a series of screenshots depicting: 1. Trainer selection. 2. Calendar view with time slots. 3. Confirmation page.)*

*   **How an Administrator Adds a New Trainer Photo:**
    1.  Log in to the Admin account.
    2.  Navigate to the "Admin Dashboard" and select "Trainer Management."
    3.  If adding a new trainer, click "Add New Trainer." If updating an existing one, find the trainer in the list and click "Edit."
    4.  In the trainer form (`TrainerForm.jsx`), locate the "Profile Picture" or "Upload Image" field.
    5.  Click "Choose File" or "Browse" and select the trainer's image from your computer (e.g., `trainer_photo.jpeg`). Supported formats are typically JPG, PNG. Ensure the file size is reasonable.
    6.  The selected image name may appear.
    7.  Fill in/update other trainer details as necessary.
    8.  Click "Save Trainer" or "Update Trainer." The photo will be uploaded to `backend/uploads/trainers/` and displayed on their profile.
    *(Visual: Screenshot of the admin trainer form highlighting the photo upload field.)*

*   **How a Client Views Their Upcoming Appointments:**
    1.  Log in to your AmigosFitnessGym account.
    2.  Look for a "My Account," "My Profile," or your name in the navigation bar. Click on it.
    3.  In your profile area, there should be a section titled "My Appointments," "My Schedule," or "Bookings."
    4.  This section will list all your upcoming (and possibly past) appointments with details like service/class name, trainer, date, and time.
    *(Visual: Screenshot of a client's "My Appointments" page.)*

## 5. Troubleshooting

| Issue                                     | Possible Cause                                         | Solution                                                                                                                               |
| :---------------------------------------- | :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| Cannot log in                             | Incorrect email or password.                           | Double-check your email and password for typos. Use the "Forgot Password" feature on the login page if you've forgotten your password. |
|                                           | Account not yet activated (for new registrations).     | Check your email inbox (and spam/junk folder) for a verification email from AmigosFitnessGym and click the activation link.          |
|                                           | Admin account trying to log in via client portal.      | Ensure you are using the correct login page/credentials for admin access if it's separate.                                             |
| Feature not loading / Page is blank       | Slow or unstable internet connection.                  | Refresh your browser (Ctrl+R or Cmd+R). Check your internet connection strength. Try accessing from a different network if possible.  |
|                                           | Browser cache or cookie issue.                         | Clear your browser’s cache and cookies for the AmigosFitnessGym site, then try again. Try using an incognito/private browsing window.  |
|                                           | Outdated browser.                                      | Ensure your web browser is updated to the latest version.                                                                              |
| Appointment time slot is not available    | The slot is already booked by another user.            | Try selecting a different date, time, or an alternative trainer/class.                                                                 |
|                                           | Trainer's schedule is full or not set for that time.   | Check other available times or contact the gym if you believe there's an error.                                                        |
| Payment failed during membership purchase | Incorrect payment details entered.                     | Carefully re-enter your credit/debit card number, expiry date, and CVV. Ensure the billing address matches the card's registered address. |
|                                           | Insufficient funds in the account.                     | Check your bank account or card balance.                                                                                               |
|                                           | Bank declining the transaction for security reasons.   | Contact your bank to authorize the transaction. Try a different payment method.                                                        |
| Cannot upload trainer photo (Admin)       | File format not supported (e.g., TIFF, BMP).           | Convert the image to a supported format like JPG, JPEG, or PNG.                                                                        |
|                                           | File size too large.                                   | Resize or compress the image to meet the system's maximum file size limit (if specified, e.g., < 2MB or < 5MB).                      |
|                                           | Server or network issue during upload.                 | Check your internet connection. Try uploading again after a few minutes.                                                               |
| Error message "Server error" or "500 error" | Temporary issue with the website's backend server.   | Wait a few minutes and try the action again. If the problem persists, contact support.                                                 |

## 6. FAQs (`Frontend/src/pages/FAQs.jsx`)

*   **Q: How do I reset my password if I've forgotten it?**
    A: On the login page, click the "Forgot Password?" or "Reset Password" link. Enter the email address associated with your AmigosFitnessGym account. You will receive an email with instructions and a link to create a new password.

*   **Q: Can I use the AmigosFitnessGym system on my mobile phone or tablet?**
    A: Yes, the AmigosFitnessGym website is designed to be mobile-responsive. This means the layout will adapt to fit various screen sizes, allowing you to browse, book, and manage your account conveniently from your smartphone or tablet's web browser.

*   **Q: How can I cancel or reschedule a booked appointment?**
    A: Log in to your account and navigate to the "My Appointments" or "My Schedule" section. You should see a list of your upcoming bookings. Next to each appointment, there will typically be options to "Cancel" or "Reschedule." Please be aware of the gym's cancellation policy (e.g., you might need to cancel at least 24 hours in advance to avoid a fee).

*   **Q: How do I update my payment information for my membership?**
    A: Log in to your account and go to your "Profile," "Account Settings," or "Membership" section. There should be an option to "Update Payment Method" or "Manage Billing" where you can enter new card details.

*   **Q: Who can see my personal information?**
    A: AmigosFitnessGym takes your privacy seriously. Your personal information is primarily used for managing your account, bookings, and memberships. Only authorized administrators will have access to the necessary details for operational purposes. For more detailed information, please refer to our Privacy Policy (usually linked in the website footer).

*   **Q: What types of fitness classes are offered?**
    A: AmigosFitnessGym offers a diverse range of classes to suit various fitness levels and interests. These typically include (but are not limited to): Yoga, Zumba, Boxing, Circuit Training, Strength and Conditioning, Athletic Training, Body Toning, Dynamic Functional Training, Muay Thai, Running Clinics, and Tabata. Please check the "Services" or "Classes" page on our website for the most current schedule and descriptions.

*   **Q: Is there a trial period or a way to try a class before committing to a membership?**
    A: This depends on current promotions. AmigosFitnessGym may offer introductory offers, day passes, or drop-in rates for certain classes. Please check the "Pricing" page or contact our support team for information on trial options.

## 7. Contact and Support

For any questions, technical difficulties, or support needs related to the AmigosFitnessGym system, please do not hesitate to contact us. Our dedicated support team is here to help.

*   **Email:** `gitquackdev@gmail.com`

