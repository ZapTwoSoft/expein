import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, DollarSign, PieChart, TrendingUp, Users, Shield, Smartphone } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
        <div className=" mx-auto max-w-6xl py-4 px-6 lg:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <DollarSign className="h-8 w-8 text-[#9ef2bd]" /> */}
              <span className="text-2xl text-[#9ef2bd] font-bold">Expein.</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="px-4 py-2 rounded-lg bg-brand text-black font-medium hover:bg-brand-400 transition-colors">
                Home
              </a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                About us
              </a>
              <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-white hover:text-brand hover:bg-white/5"
              >
                Sign in
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-brand text-black hover:bg-brand-400 font-medium"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-12 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 left-20 w-16 h-16 border border-white/10 rounded-lg rotate-12"></div>
        <div className="absolute top-60 right-32 w-8 h-8 border-2 border-white/10 rounded-full"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 border border-white/10"></div>
        <div className="absolute bottom-60 right-20 w-6 h-6 border border-white/10 rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 border border-white/10 rounded-full"></div>
        
        <div className=" mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <span className="text-gray-400 text-sm">Next generation of</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Expense tracking<span className="text-brand">.</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
            Expein is the ultimate tool for managing your money and staying on top of your
              expenses. With our easy-to-use app, you can quickly input and categorize
              your expenses, set and track a budget.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/signup')}
                size="lg"
                className="bg-brand text-black hover:bg-brand-400 font-medium px-8 py-6 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-white/20 text-white hover:bg-white/5 hover:text-white px-8 py-6 text-lg"
              >
                How it works
              </Button>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-12 flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full"></div>
              
              {/* iPhone Frame */}
              <div className="relative">
                {/* iPhone outer frame with realistic bezels */}
                <div className="relative bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] rounded-[3.5rem] w-[340px] h-[690px] p-3 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] border border-gray-800/50">
                  
                  {/* Screen */}
                  <div className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-[3rem] h-full overflow-hidden">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-full z-50 shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rounded-full"></div>
                      <div className="absolute top-2 left-8 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                    </div>
                    
                    {/* Status bar */}
                    <div className="absolute top-4 left-0 right-0 px-8 flex items-center justify-between text-white text-xs z-40">
                      <span className="font-semibold">9:41</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-3" fill="currentColor" viewBox="0 0 20 12">
                          <rect x="0" y="3" width="3" height="6" rx="1"/>
                          <rect x="5" y="2" width="3" height="8" rx="1"/>
                          <rect x="10" y="1" width="3" height="10" rx="1"/>
                          <rect x="15" y="0" width="3" height="12" rx="1"/>
                        </svg>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6zm2 0v8h12V6H4zm14-2v12h2V4h-2z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* App content */}
                    <div className="relative pt-16 px-5 pb-8 h-full overflow-y-auto">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-brand to-brand-400 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-lg">V</span>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400">Welcome Back!</div>
                            <div className="text-sm font-semibold text-white">Alkemy Hossain</div>
                          </div>
                        </div>
                        <div className="w-9 h-9 bg-gray-800/80 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Balance Card */}
                      <div className="bg-gradient-to-br from-brand to-brand-400 rounded-2xl p-5 mb-5 shadow-lg">
                        <div className="text-xs text-black/60 mb-1">Remaining cash</div>
                        <div className="text-3xl font-bold text-black mb-2">৳2,351.31</div>
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] text-black/60">
                            Spending limit: <span className="text-black font-semibold">৳10,000.00</span>
                          </div>
                          <svg className="w-4 h-4 text-black/30" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Chart Section */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-semibold text-sm">Spending Overview</h3>
                          <span className="text-xs text-gray-400">This month</span>
                        </div>
                        <div className="bg-gray-800/60 backdrop-blur rounded-2xl p-4">
                          {/* Mini Bar Chart */}
                          <div className="flex items-end justify-between h-32 gap-2">
                            <div className="flex-1 flex flex-col items-center justify-end">
                              <div className="w-full bg-gradient-to-t from-brand to-brand/40 rounded-t-lg" style={{height: '45%'}}></div>
                              <span className="text-[9px] text-gray-400 mt-2">Mon</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-end">
                              <div className="w-full bg-gradient-to-t from-brand to-brand/40 rounded-t-lg" style={{height: '78%'}}></div>
                              <span className="text-[9px] text-gray-400 mt-2">Tue</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-end">
                              <div className="w-full bg-gradient-to-t from-brand to-brand/40 rounded-t-lg" style={{height: '62%'}}></div>
                              <span className="text-[9px] text-gray-400 mt-2">Wed</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-end">
                              <div className="w-full bg-gradient-to-t from-brand to-brand/40 rounded-t-lg" style={{height: '91%'}}></div>
                              <span className="text-[9px] text-gray-400 mt-2">Thu</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-end">
                              <div className="w-full bg-gradient-to-t from-brand to-brand/40 rounded-t-lg" style={{height: '55%'}}></div>
                              <span className="text-[9px] text-gray-400 mt-2">Fri</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-end">
                              <div className="w-full bg-gradient-to-t from-brand to-brand/40 rounded-t-lg" style={{height: '38%'}}></div>
                              <span className="text-[9px] text-gray-400 mt-2">Sat</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-end">
                              <div className="w-full bg-gradient-to-t from-brand to-brand/40 rounded-t-lg" style={{height: '28%'}}></div>
                              <span className="text-[9px] text-gray-400 mt-2">Sun</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Category Cards */}
                      <div>
                        <h3 className="text-white font-semibold text-sm mb-3">Categories</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-800/60 backdrop-blur rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <div className="text-[10px] text-red-400 font-medium">-24%</div>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">Groceries</div>
                            <div className="text-base font-semibold text-white">$1,245.80</div>
                          </div>
                          <div className="bg-gray-800/60 backdrop-blur rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              </div>
                              <div className="text-[10px] text-green-400 font-medium">-12%</div>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">Transport</div>
                            <div className="text-base font-semibold text-white">$324.50</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </div>
                
                {/* Power button and volume buttons */}
                <div className="absolute right-0 top-[120px] w-1 h-16 bg-gray-700 rounded-l-sm"></div>
                <div className="absolute left-0 top-[100px] w-1 h-8 bg-gray-700 rounded-r-sm"></div>
                <div className="absolute left-0 top-[140px] w-1 h-8 bg-gray-700 rounded-r-sm"></div>
                <div className="absolute left-0 top-[180px] w-1 h-8 bg-gray-700 rounded-r-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-black/30">
        <div className=" mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to take control of your finances in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Categorization</h3>
              <p className="text-gray-400">
                Automatically categorize your expenses and get insights into your spending patterns
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget Tracking</h3>
              <p className="text-gray-400">
                Set budgets and get real-time alerts when you're approaching your limits
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-400">
                Bank-level encryption keeps your financial data safe and secure
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Platform</h3>
              <p className="text-gray-400">
                Access your finances anywhere with our web and mobile applications
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-brand/20 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Income Management</h3>
              <p className="text-gray-400">
                Track multiple income sources and see your complete financial picture
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-[#9ef2bd]/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#9ef2bd]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Loan Tracking</h3>
              <p className="text-gray-400">
                Manage loans you've given or taken with reminders and payment tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6">
        <div className=" mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Take control of your financial future
              </h2>
              <p className="text-gray-400 text-lg mb-5">
              Expein was built by people who understand the struggle of managing personal finances. 
                We believe everyone deserves access to powerful financial tools without the complexity.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-brand mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">Easy expense tracking and categorization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-brand mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">Visual insights with charts and reports</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-brand mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">Manage income, expenses, and loans in one place</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-brand mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">Simple and intuitive interface</span>
                </li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-brand/10 blur-3xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-3xl p-6">
                <div className="space-y-4">
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Total Expenses</span>
                      <TrendingUp className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="text-2xl font-bold">$8,234.50</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Total Income</span>
                      <TrendingUp className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-2xl font-bold">$12,500.00</div>
                  </div>
                  <div className="bg-gradient-to-br from-brand/20 to-brand/10 rounded-xl p-4 border border-brand/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Savings</span>
                      <CheckCircle2 className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-2xl font-bold text-brand">$4,265.50</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-6 bg-black/30">
        <div className=" mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              What our users say
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial lives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-400 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-400">Freelance Designer</div>
                </div>
              </div>
              <p className="text-gray-300">
                "Expein has completely changed how I manage my finances. I can finally see where my money goes and plan better for the future."
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-gray-400">Software Engineer</div>
                </div>
              </div>
              <p className="text-gray-300">
                "The interface is so clean and intuitive. I actually enjoy tracking my expenses now, which I never thought I'd say!"
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Emily Rodriguez</div>
                  <div className="text-sm text-gray-400">Small Business Owner</div>
                </div>
              </div>
              <p className="text-gray-300">
                "Perfect for keeping track of both personal and business expenses. The loan tracking feature is a game-changer!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className=" mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 rounded-3xl p-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              Ready to get started?
            </h2>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              Join Expein today and take the first step towards financial freedom
            </p>
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="bg-brand text-black hover:bg-brand-400 font-medium px-8 py-6 text-lg"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className=" mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg text-[#9ef2bd] font-bold">Expein.</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your personal finance companion for a better financial future.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Expein. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
