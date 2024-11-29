import React from 'react';

import '../styles/landingPage.css';

import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Anchor from '../components/Anchor';
import Logo from '../components/Logo';

import BannerPerson from '../images/Banner Person.png';
import TimeTracking from '../images/Time Tracking.png';
import RealTimeSyncronozation from '../images/Real-Time Synchronozation.png';
import PomodoroTimer from '../images/Pomodoro TImer.png';

import FeatureFast from '../images/Feature Fast.png';
import FeatureLight from '../images/Feature Light.png';
import FeaturePowerfulAndSecure from '../images/Feature Powerful And Secure.png';

export default class LandingPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mobile: false
		};
	};
	componentDidMount() {
		const navbar = document.getElementById('navbar');
		const banner = document.getElementById('banner');

		const bannerHeightChange = () => {
			if (!matchMedia('screen and (max-width: 60rem)').matches)
				banner.style.height = `${window.innerHeight - navbar.offsetHeight}px`;
			else
				banner.style.height = 'auto';
		};
		window.addEventListener('resize', bannerHeightChange);
		bannerHeightChange();



		const setMobile = () => {
			this.setState({
				mobile: matchMedia('screen and (max-width: 60rem)').matches
			});
		};

		window.addEventListener('resize', setMobile);
		setMobile();

		const root = document.getElementById('root');
		root.setAttribute('page', 'landingPage');
	};
	render() {
		return (
			<>
				<Navbar>
					<Anchor href='/' className='active'>Home</Anchor>
					<Anchor href='/about'>About</Anchor>
					<Anchor href='/contact'>Contact</Anchor>
				</Navbar>

				<main
					id='banner'
				>
					<div>
						<div>
							{
								this.state.mobile ? null : <h4>Stay on top of your tasks with</h4>
							}

							{
								this.state.mobile ? null : <Logo head='1' />
							}

							<p>An all-in-one web application for <b>task management</b>, <b>time tracking</b>, and a built-in <b>Pomodoro timer</b> to supercharge your productivity.</p>

							<div>
								<Button
									label='Get Started'
									href='/signUp'
									type='CallToAction'
									head='6'
									filled={true}
									theme='dark'
								/>
								<Button
									label='Contact Us'
									href='/contact'
									type='CallToAction'
									head='6'
									theme='dark'
								/>
							</div>
						</div>

						<img src={BannerPerson} alt='Banner Person' />

						{
							this.state.mobile ? (
								<h4>Stay on top of your tasks!</h4>
							) : null
						}
					</div>
				</main>

				<section
					id='features'
				>
					<h2>Why choose us?</h2>

					<div>
						<div>
							<img src={TimeTracking} alt='Time Tracking' />
							<p>Easily monitor task durations and track your progress with our integrated time tracker.</p>
						</div>
						<div>
							<img src={RealTimeSyncronozation} alt='Real-time Synchronization' />
							<p>Collaborate seamlessly with your team using real-time synchronization for project management.</p>
						</div>
						<div>
							<img src={PomodoroTimer} alt='Pomodoro Timer' />
							<p>Boost your focus and productivity with our built-in Pomodoro timer, designed to help you manage your time effectively.</p>
						</div>
					</div>
				</section>

				<section className='capabilities'>
					<article>
						<h1>Fast</h1>
						<p>Rapidly manage your tasks with our web application, designed to be fast and responsive for a seamless user experience.</p>
						<p>Our web application is optimized for speed, so you can manage your tasks efficiently and effectively.</p>

						<div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<g clip-path='url(#clip0_290_490)'>
										<path d='M400 800C180 800 0 620 0 400C0 180 180 0 400 0C620 0 800 180 800 400C800 620 620 800 400 800ZM400 80C224 80 80 224 80 400C80 576 224 720 400 720C576 720 720 576 720 400C720 224 576 80 400 80Z' fill='var(--color-primary)' />
										<path d='M344 456C312 424 232 228 232 228C232 228 428 308 460 340C492 372 492 420 460 452C424 488 376 488 344 456Z' fill='var(--color-primary)' />
									</g>
									<defs>
										<clipPath id='clip0_290_490'>
											<rect width='800' height='800' fill='var(--color-white)' />
										</clipPath>
									</defs>
								</svg>

								<h3>Optimized for Speed</h3>
								<p>Our web application is designed to be fast and responsive, so you can manage your tasks efficiently.</p>
							</div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<path d='M36.3633 727.272H763.636' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' strokeLinejoin='round' />
									<path d='M36.3633 72.7269H763.636' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' strokeLinejoin='round' />
									<path fill-rule='evenodd' clip-rule='evenodd' d='M581.818 581.818H218.181C178.015 581.818 145.454 549.257 145.454 509.091V290.909C145.454 250.743 178.015 218.181 218.181 218.181H581.818C621.984 218.181 654.545 250.743 654.545 290.909V509.091C654.545 549.257 621.984 581.818 581.818 581.818Z' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' strokeLinejoin='round' />
								</svg>

								<h3>Sleek User Interface</h3>
								<p>Maintain focus on your tasks with our sleek user interface, designed for a seamless user experience.</p>
							</div>
						</div>
					</article>
					<img src={FeatureFast} alt='Fast' />
				</section>

				<section className='capabilities'>
					<article>
						<h1>Light</h1>
						<p>Built with a lightweight design, our web application is fast and responsive, so you can manage your tasks with ease.</p>
						<p>Our web application is accessible from any device with an internet connection, so you can manage your tasks on the go.</p>

						<div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<path d='M50 750L622.667 177.333' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' strokeLinecap='round' />
									<path d='M336.333 463.667H463.666' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' strokeLinecap='round' />
									<path d='M592.667 50C634.367 50.0881 674.334 66.6925 703.821 96.1791C733.307 125.666 749.912 165.633 750 207.333C749.986 249.164 733.454 289.297 704 319L433.333 591H209V368.333L481 96C510.703 66.5463 550.836 50.014 592.667 50Z' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' strokeLinecap='round' />
									<path d='M431.667 241V368.333' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' strokeLinecap='round' />
								</svg>

								<h3>Lighweight Design</h3>
								<p>Our web application is designed to be lightweight and responsive, so you can manage your tasks with ease.</p>
							</div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<path d='M533.334 100H266.667C211.439 100 166.667 144.772 166.667 200V600C166.667 655.228 211.439 700 266.667 700H533.334C588.562 700 633.334 655.228 633.334 600V200C633.334 144.772 588.562 100 533.334 100Z' stroke='var(--color-primary)' strokeWidth='40' />
									<path d='M533.334 100H478.584C450.85 100 425.5 115.668 413.097 140.472C407.7 151.265 392.3 151.265 386.904 140.472C374.5 115.668 349.15 100 321.417 100H266.667' stroke='var(--color-primary)' strokeWidth='40' />
									<path d='M316.667 366.667L483.334 533.333' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' />
									<path d='M483.334 366.667L316.667 533.333' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' />
								</svg>

								<h3>No Installation Required</h3>
								<p>All you need is an internet connection to access our web application, so you can manage your tasks from anywhere.</p>
							</div>
						</div>
					</article>
					<img src={FeatureLight} alt='Light' />
				</section>

				<section className='capabilities'>
					<article>
						<h1>Powerful</h1>
						<p>Take control of your tasks with our web application, designed to be powerful and feature-rich for enhanced task management.</p>

						<div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<path d='M200 100V493.333C200 530.67 200 549.34 207.266 563.6C213.658 576.143 223.856 586.343 236.401 592.733C250.661 600 269.33 600 306.667 600H500M700 600H600M600 700V306.667C600 269.33 600 250.661 592.733 236.401C586.343 223.856 576.143 213.658 563.6 207.266C549.34 200 530.67 200 493.333 200H300M100 200H200' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' strokeLinejoin='round' />
								</svg>

								<h3>Work Efficiently</h3>
								<p>Our web application is designed to help you work efficiently, so you can manage your tasks with ease.</p>
							</div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<path d='M400 463.667C435.162 463.667 463.667 435.162 463.667 400C463.667 364.838 435.162 336.333 400 336.333C364.838 336.333 336.333 364.838 336.333 400C336.333 435.162 364.838 463.667 400 463.667Z' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M304.667 559C304.667 533.716 314.711 509.468 332.589 491.589C350.467 473.711 374.716 463.667 400 463.667C425.284 463.667 449.532 473.711 467.411 491.589C485.289 509.468 495.333 533.716 495.333 559' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M686.333 177.333C721.495 177.333 750 148.829 750 113.667C750 78.5045 721.495 50 686.333 50C651.171 50 622.667 78.5045 622.667 113.667C622.667 148.829 651.171 177.333 686.333 177.333Z' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M113.667 750C148.829 750 177.333 721.495 177.333 686.333C177.333 651.171 148.829 622.667 113.667 622.667C78.5045 622.667 50 651.171 50 686.333C50 721.495 78.5045 750 113.667 750Z' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M670.333 750C714.332 750 750 714.332 750 670.333C750 626.335 714.332 590.667 670.333 590.667C626.335 590.667 590.667 626.335 590.667 670.333C590.667 714.332 626.335 750 670.333 750Z' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M129.667 209.333C173.665 209.333 209.333 173.665 209.333 129.667C209.333 85.668 173.665 50 129.667 50C85.668 50 50 85.668 50 129.667C50 173.665 85.668 209.333 129.667 209.333Z' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M265 535L158.333 641.667' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M641.667 158.333L535 265' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M591 400C591.447 444.348 576.474 487.475 548.641 522.004C520.807 556.534 481.843 580.322 438.411 589.301C394.979 598.279 349.776 591.891 310.533 571.228C271.29 550.565 240.444 516.91 223.27 476.02C206.096 435.129 203.661 389.542 216.381 347.055C229.1 304.567 256.185 267.818 293.003 243.092C329.821 218.365 374.086 207.197 418.228 211.497C462.369 215.798 503.646 235.299 535 266.667C570.543 301.971 590.674 349.904 591 400Z' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M614 614L535 535' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
									<path d='M265 265L186 186' stroke='var(--color-primary)' strokeWidth='40' stroke-miterlimit='10' />
								</svg>

								<h3>Easily Collaborate</h3>
								<p>Collaborate with your team seamlessly using our web application, designed for real-time synchronization.</p>
							</div>
						</div>

						<div></div>
						<div></div>

						<h1>& Secure</h1>
						<p>Designed with security in mind, so you can manage your tasks with confidence.</p>

						<div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<path d='M400 483.333V550M233.333 334.293C249.047 333.333 268.42 333.333 293.333 333.333H506.667C531.58 333.333 550.953 333.333 566.667 334.293M233.333 334.293C213.723 335.49 199.81 338.183 187.934 344.233C169.118 353.82 153.82 369.117 144.233 387.933C133.334 409.327 133.333 437.327 133.333 493.333V540C133.333 596.007 133.334 624.007 144.233 645.4C153.82 664.217 169.118 679.513 187.934 689.1C209.325 700 237.328 700 293.333 700H506.667C562.673 700 590.673 700 612.067 689.1C630.883 679.513 646.18 664.217 655.767 645.4C666.667 624.007 666.667 596.007 666.667 540V493.333C666.667 437.327 666.667 409.327 655.767 387.933C646.18 369.117 630.883 353.82 612.067 344.233C600.19 338.183 586.277 335.49 566.667 334.293M233.333 334.293V266.667C233.333 174.619 307.953 100 400 100C492.047 100 566.667 174.619 566.667 266.667V334.293' stroke='var(--color-primary)' strokeWidth='40' strokeLinecap='round' strokeLinejoin='round' />
								</svg>

								<h3>Secure Data</h3>
								<p>Your data is secure with our web application, so you can manage your tasks with confidence.</p>
							</div>
							<div>
								<svg viewBox='0 0 800 800' fill='transparent'>
									<path d='M621.44 255.039C623.299 242.648 624.154 230.13 624 217.602C586.71 178.848 541.984 148.019 492.496 126.961C443.008 105.903 389.779 95.0467 336 95.0467C282.219 95.0467 228.993 105.903 179.506 126.961C130.019 148.019 85.2902 178.848 48 217.602C48 667.52 336 735.04 336 735.04C357.299 726.026 377.846 715.325 397.44 703.04' stroke='var(--color-primary)' strokeWidth='48' strokeLinecap='round' strokeLinejoin='round' />
									<path d='M688 349.437H496C460.653 349.437 432 378.093 432 413.437V573.437C432 608.784 460.653 637.437 496 637.437H688C723.347 637.437 752 608.784 752 573.437V413.437C752 378.093 723.347 349.437 688 349.437Z' stroke='var(--color-primary)' strokeWidth='48' strokeLinecap='round' strokeLinejoin='round' />
									<path d='M432 447.04H486.08C498.81 447.04 511.021 452.099 520.022 461.101C529.024 470.102 534.08 482.307 534.08 495.04C534.08 507.77 529.024 519.974 520.022 528.976C511.021 537.978 498.81 543.04 486.08 543.04H432' stroke='var(--color-primary)' strokeWidth='48' strokeLinecap='round' strokeLinejoin='round' />
								</svg>

								<h3>Enhanced Privacy</h3>
								<p>Protect your privacy with our web application, designed to keep your data safe and secure.</p>
							</div>
						</div>
					</article>
					<img src={FeaturePowerfulAndSecure} alt='Powerful And Secure' />
				</section>

				<section id='callToAction'>
					<h3>Are you ready?</h3>
					<p>Say goodbye to procrastination and hello to productivity with our all-in-one web application for task management, time tracking, and Pomodoro timer.</p>
					<Button
						label='Get Started'
						href='/signUp'
						type='CallToAction'
						head='6'
						theme='light'
					/>

					<svg viewBox='0 0 1440 854'>
						<path d='M1436.04 854H-0.875604C-0.875604 765.5 -0.875702 224 -0.999505 131.265C197.162 169.746 392.739 168.245 627 100.802C1044.5 -19.3962 1416 -5.50003 1440.5 11C1465 27.5 1436.04 854 1436.04 854Z' fill='var(--color-tertiary)' />
					</svg>
				</section>

				<section id='footer'>
					<div>
						<div>
							<span>© 2024<br />All rights reserved.</span>
						</div>

						<Logo
							head='4'
							theme='light'
							strip={true}
						/>

						<div>
							<Anchor theme='light' href='/' className='active'>Home</Anchor>
							<Anchor theme='light' href='/about'>About</Anchor>
							<Anchor theme='light' href='/contact'>Contact</Anchor>
						</div>
					</div>

					<svg viewBox='0 0 1440 354'>
						<path d='M925.643 77C1324.92 12.212 1403.1 31.7986 1440 0V354H-1V141.949C332.005 210.771 526.366 141.788 925.643 77Z' fill='var(--color-primary)' />
					</svg>
				</section>
			</>
		);
	};
};