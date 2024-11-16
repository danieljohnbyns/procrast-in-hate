import React from 'react';

/**
 * @type {(props: {
 * 		head: '6' | '5' | '4' | '3' | '2' | '1'
 * }) => JSX.Element}
 */
const Logo = ({
	head = '5'
}) => {
	return (
		<div
			className='logo'
			head={head}
		>
			<svg viewBox='0 0 120 120'>
				<path d='M36.6667 46.6667C29.3029 46.6667 23.3333 40.6971 23.3333 33.3333C23.3333 25.9695 29.3029 20 36.6667 20H110C102.636 20 96.6667 25.9695 96.6667 33.3333C96.6667 40.6971 102.636 46.6667 110 46.6667H103.333M36.6667 46.6667H23.3333C15.9695 46.6667 10 52.6362 10 60C10 67.3638 15.9695 73.3333 23.3333 73.3333H36.6667M36.6667 46.6667H45M36.6667 73.3333C29.3029 73.3333 23.3333 79.3029 23.3333 86.6667C23.3333 94.0305 29.3029 100 36.6667 100H110C102.636 100 96.6667 94.0305 96.6667 86.6667C96.6667 79.3029 102.636 73.3333 110 73.3333H103.333M36.6667 73.3333H103.333M103.333 73.3333C95.9695 73.3333 90 67.3638 90 60C90 52.6362 95.9695 46.6667 103.333 46.6667M103.333 46.6667H86.6667H70M70 46.6667V60L57.5 50L45 60V46.6667M70 46.6667V33.3333M45 46.6667V33.3333' stroke='url(#paint0_linear_78_4)' stroke-width='5' stroke-linecap='round' stroke-linejoin='round' fill='transparent' />
				<defs>
					<linearGradient id='paint0_linear_78_4' x1='60' y1='100' x2='60' y2='20' gradientUnits='userSpaceOnUse'>
						<stop offset='0.5' stop-color='var(--color-primary)' />
						<stop offset='1' stop-color='var(--color-secondary)' />
					</linearGradient>
				</defs>
			</svg>

			<div>
				{
					head === '6' ? <><h6>Tempo</h6><h6>Task</h6></> :
						head === '5' ? <><h5>Tempo</h5><h5>Task</h5></> :
							head === '4' ? <><h4>Tempo</h4><h4>Task</h4></> :
								head === '3' ? <><h3>Tempo</h3><h3>Task</h3></> :
									head === '2' ? <><h2>Tempo</h2><h2>Task</h2></> :
										head === '1' ? <><h1>Tempo</h1><h1>Task</h1></> :
											<><h5>Tempo</h5><h5>Task</h5></>
				}
			</div>
		</div>
	);
};

export default Logo;