import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import AIChatModal from './components/AIChatModal'

// Type definitions
interface BudgetResult {
  needs: number;
  wants: number;
  savings: number;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'education' | 'emergency' | 'purchase' | 'debt' | 'other';
}

interface AuthFormData {
  email: string;
  password: string;
}

// Custom hooks with proper typing
function useShowAIChat(): boolean {
  const location = useLocation()
  return ["/", "/calculator", "/goals"].includes(location.pathname)
}

function useIsAuthPage(): boolean {
  const location = useLocation()
  return ['/login', '/signup'].includes(location.pathname)
}

// Placeholder page components
function Home(): React.JSX.Element {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Take Control of Your Financial Future</h1>
          <p className="hero-subtitle">The smart way to manage your money as a student</p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Smart Budgeting</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Goal Tracking</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📱</span>
              <span>Student-Friendly</span>
            </div>
          </div>
          <div className="hero-cta">
            <Link to="/calculator" className="cta-button primary">Start Budgeting</Link>
            <Link to="/about" className="cta-button secondary">Learn More</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-content">
              <h3>50/30/20 Rule</h3>
              <p>Smart budgeting for students</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-content">
              <h3>Track Goals</h3>
              <p>Save for what matters</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-content">
              <h3>Student Loans</h3>
              <p>Plan your payments</p>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main className="main-content">
        <section className="features-section container">
          <h2>Why Choose Coincise?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Student-Focused</h3>
              <p>Tools and resources designed specifically for college students and young adults.</p>
            </div>
            <div className="feature-card">
              <h3>Easy to Use</h3>
              <p>Simple, intuitive interface that makes financial management straightforward.</p>
            </div>
            <div className="feature-card">
              <h3>Smart Planning</h3>
              <p>Advanced calculators and tools to help you make informed financial decisions.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
function About(): React.JSX.Element {
  return (
    <div className="container">
      <main style={{ marginTop: '80px', padding: '2rem' }}>
        <h1>Your Financial Journey Starts Here</h1>
        <section className="feature-section">
          <h2>Why Coincise?</h2>
          <p>Coincise is your personal finance companion, designed specifically for college students and young adults. We understand the unique financial challenges you face:</p>
          <ul>
            <li>Managing student loans and financial aid</li>
            <li>Balancing part-time work with studies</li>
            <li>Planning for post-graduation life</li>
            <li>Building healthy financial habits early</li>
          </ul>
        </section>
        <section className="feature-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Smart Budgeting</h3>
              <p>Our 50/30/20 rule calculator helps you allocate your income wisely between needs, wants, and savings.</p>
            </div>
            <div className="feature-card">
              <h3>Goal Tracking</h3>
              <p>Set and track your financial goals, whether it's saving for a new laptop or paying off student loans.</p>
            </div>
            <div className="feature-card">
              <h3>Student Resources</h3>
              <p>Access guides and tips specifically designed for college students' financial needs.</p>
            </div>
          </div>
        </section>
        <section className="feature-section">
          <h2>Our Mission</h2>
          <p>We believe that financial literacy should be accessible to everyone. Our goal is to empower young adults with the knowledge and tools they need to make informed financial decisions and build a secure future.</p>
        </section>
      </main>
    </div>
  );
}
function Calculator(): React.JSX.Element {
  const handleBudgetSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const income = parseFloat(formData.get('income') as string);
    
    if (isNaN(income) || income <= 0) {
      alert('Please enter a valid income amount');
      return;
    }

    const result: BudgetResult = {
      needs: income * 0.5,
      wants: income * 0.3,
      savings: income * 0.2
    };

    // Update the results display
    const needsElement = document.querySelector('.result-card:nth-child(1) p');
    const wantsElement = document.querySelector('.result-card:nth-child(2) p');
    const savingsElement = document.querySelector('.result-card:nth-child(3) p');

    if (needsElement) needsElement.textContent = `$${result.needs.toFixed(2)}`;
    if (wantsElement) wantsElement.textContent = `$${result.wants.toFixed(2)}`;
    if (savingsElement) savingsElement.textContent = `$${result.savings.toFixed(2)}`;
  };

  return (
    <div className="container calculator-grid">
      <div className="calculator-section">
        <h2>50/30/20 Budget Calculator</h2>
        <p>Use this calculator to divide your income into needs (50%), wants (30%), and savings (20%).</p>
        <form className="calculator-form" onSubmit={handleBudgetSubmit}>
          <div className="form-group">
            <label htmlFor="income">Monthly Income ($)</label>
            <input type="number" id="income" name="income" placeholder="Enter your monthly income" required />
          </div>
          <button type="submit" className="calculator-btn">Calculate Budget</button>
          <div className="results">
            <div className="result-card">
              <h3>Needs (50%)</h3>
              <p>$0.00</p>
              <small>Housing, utilities, groceries, etc.</small>
            </div>
            <div className="result-card">
              <h3>Wants (30%)</h3>
              <p>$0.00</p>
              <small>Entertainment, dining out, shopping, etc.</small>
            </div>
            <div className="result-card">
              <h3>Savings (20%)</h3>
              <p>$0.00</p>
              <small>Emergency fund, investments, etc.</small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
function Goals(): React.JSX.Element {
  const handleGoalSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newGoal: Omit<Goal, 'id'> = {
      name: formData.get('goal-name') as string,
      targetAmount: parseFloat(formData.get('goal-amount') as string),
      currentAmount: 0,
      deadline: formData.get('goal-deadline') as string,
      category: formData.get('goal-category') as Goal['category']
    };

    // Here you would typically save to backend/localStorage
    console.log('New goal:', newGoal);
    alert('Goal added successfully!');
    e.currentTarget.reset();
  };

  return (
    <div className="container">
      <section className="goals-form-section">
        <h2>Create New Goal</h2>
        <form className="goal-form" onSubmit={handleGoalSubmit}>
          <div className="form-group">
            <label htmlFor="goal-name">Goal Name</label>
            <input type="text" id="goal-name" name="goal-name" placeholder="e.g., New Laptop, Emergency Fund" required />
          </div>
          <div className="form-group">
            <label htmlFor="goal-amount">Target Amount ($)</label>
            <input type="number" id="goal-amount" name="goal-amount" placeholder="Enter target amount" required />
          </div>
          <div className="form-group">
            <label htmlFor="goal-deadline">Target Date</label>
            <input type="date" id="goal-deadline" name="goal-deadline" required />
          </div>
          <div className="form-group">
            <label htmlFor="goal-category">Category</label>
            <select id="goal-category" name="goal-category" required>
              <option value="">Select a category</option>
              <option value="education">Education</option>
              <option value="emergency">Emergency Fund</option>
              <option value="purchase">Major Purchase</option>
              <option value="debt">Debt Repayment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="calculator-btn">Add Goal</button>
        </form>
      </section>
      <section className="goals-list-section">
        <h2>Your Goals</h2>
        <div className="goals-filter">
          <button className="filter-btn active" data-filter="all">All</button>
          <button className="filter-btn" data-filter="education">Education</button>
          <button className="filter-btn" data-filter="emergency">Emergency</button>
          <button className="filter-btn" data-filter="purchase">Purchase</button>
          <button className="filter-btn" data-filter="debt">Debt</button>
          <button className="filter-btn" data-filter="other">Other</button>
        </div>
        <div className="goals-grid">
          <div className="goal-card">
            <div className="goal-header">
              <h3 className="goal-name">New Laptop</h3>
              <span className="goal-category">Education</span>
            </div>
            <div className="goal-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '40%'}}></div>
              </div>
              <div className="progress-stats">
                <span className="current-amount">$400</span>
                <span className="target-amount">of $1000</span>
              </div>
            </div>
            <div className="goal-details">
              <p className="goal-deadline">Target: 2025-06-01</p>
              <div className="goal-actions">
                <button className="update-progress-btn">Update Progress</button>
                <button className="delete-goal-btn">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function Contact(): React.JSX.Element {
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string
    };

    // Here you would typically send to backend
    console.log('Contact form submitted:', contactData);
    alert('Message sent successfully!');
    e.currentTarget.reset();
  };

  return (
    <div className="container">
      <main style={{ marginTop: '80px', padding: '2rem' }}>
        <h1>Get in Touch</h1>
        <div className="contact-grid">
          <section className="contact-form-section">
            <h2>Send us a Message</h2>
            <form id="contact-form" className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your email address" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} placeholder="Your message" required></textarea>
              </div>
              <button type="submit" className="contact-btn">Send Message</button>
            </form>
          </section>
          <section className="contact-info-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <p>support@coincise.com</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <h3>Response Time</h3>
                  <p>Within 24 hours</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">💬</span>
                <div>
                  <h3>Social Media</h3>
                  <div className="social-links">
                    <a href="#" className="social-link">Twitter</a>
                    <a href="#" className="social-link">LinkedIn</a>
                    <a href="#" className="social-link">Instagram</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How does Coincise help students?</h3>
              <p>Coincise provides tools and resources specifically designed for students to manage their finances, track expenses, and plan for their future financial goals.</p>
            </div>
            <div className="faq-item">
              <h3>Is Coincise free to use?</h3>
              <p>Yes, Coincise offers a free version with basic features. We also have premium features available for users who need more advanced financial planning tools.</p>
            </div>
            <div className="faq-item">
              <h3>How secure is my financial data?</h3>
              <p>We take security seriously. All your data is encrypted and stored securely. We never share your personal or financial information with third parties.</p>
            </div>
            <div className="faq-item">
              <h3>Can I use Coincise on my mobile device?</h3>
              <p>Yes, Coincise is fully responsive and works on all devices, including smartphones and tablets.</p>
            </div>
          </div>
        </section>
        <section className="resources-section">
          <h2>Helpful Resources</h2>
          <div className="resources-grid">
            <a href="#" className="resource-card">
              <h3>Student Budget Guide</h3>
              <p>Learn how to create and maintain a budget as a student</p>
            </a>
            <a href="#" className="resource-card">
              <h3>Financial Aid Tips</h3>
              <p>Understanding and managing your financial aid</p>
            </a>
            <a href="#" className="resource-card">
              <h3>Student Loan Guide</h3>
              <p>Everything you need to know about student loans</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
function Login(): React.JSX.Element {
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const loginData: AuthFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    // Here you would typically authenticate with backend
    console.log('Login attempt:', loginData);
    alert('Login functionality coming soon!');
  };

  return (
    <div className="auth-page-wrapper">
      <Link to="/" className="auth-back-btn">← Back to Home</Link>
      <div className="auth-container">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p className="auth-toggle-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
function SignUp(): React.JSX.Element {
  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const signUpData: AuthFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    // Here you would typically register with backend
    console.log('Sign up attempt:', signUpData);
    alert('Sign up functionality coming soon!');
  };

  return (
    <div className="auth-page-wrapper">
      <Link to="/" className="auth-back-btn">← Back to Home</Link>
      <div className="auth-container">
        <h2>Sign Up</h2>
        <form className="auth-form" onSubmit={handleSignUpSubmit}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <p className="auth-toggle-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

function AppLayout(): React.JSX.Element {
  const [aiOpen, setAiOpen] = useState<boolean>(false)
  const showAI = useShowAIChat()
  const isAuthPage = useIsAuthPage()

  return (
    <div className="app-container">
      {!isAuthPage && (
        <nav id="navigation">
          <Link id="logo" to="/">Coincise</Link>
          <div className="items">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/calculator">Budget Calculator</Link>
            <Link to="/goals">Goals</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login" className="nav-auth">Login</Link>
            <Link to="/signup" className="nav-auth nav-signup">Sign Up</Link>
          </div>
        </nav>
      )}
      <main className={`content-wrap ${isAuthPage ? 'no-padding-top' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      {!isAuthPage && (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Coincise</h4>
              <p>Your financial journey starts here</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/about">About</Link>
              <Link to="/calculator">Calculator</Link>
              <Link to="/goals">Goals</Link>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <Link to="/contact">Get in Touch</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Coincise. All rights reserved.</p>
          </div>
        </footer>
      )}
      {showAI && (
        <>
          <button
            className="ai-chat-button"
            onClick={() => setAiOpen(true)}
            aria-label="Ask AI Financial Assistant"
            title="Chat with AI Financial Assistant"
          >
            💬
          </button>
          <AIChatModal open={aiOpen} onClose={() => setAiOpen(false)} />
        </>
      )}
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
