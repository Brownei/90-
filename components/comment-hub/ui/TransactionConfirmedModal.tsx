import React from "react";
import { ModalCloseButton } from "./FundWagerModal";

interface TransactionConfirmedModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const TransactionConfirmedModal: React.FC<TransactionConfirmedModalProps> = ({
	isOpen,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-[00000026] flex items-center justify-center z-50 p-4 px-9 backdrop-blur-[2px]">
			<div className="bg-white w-full max-w-md rounded-lg p-6 pb-16">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-sm tracking-[0.2px] font-bold text-center w-full">
						TRANSACTION CONFIRMED
					</h2>
					<ModalCloseButton onClose={onClose} />
				</div>

				<div className="flex justify-center">
					<svg
						width="141"
						height="141"
						viewBox="0 0 141 141"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							opacity="0.2"
							cx="70.0205"
							cy="70.0205"
							r="70.0205"
							fill="#01D478"
						/>
						<g clip-path="url(#clip0_847_2214)">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M57.1806 79.0321L97.5042 40.0255C99.3371 38.2525 102.29 38.2525 104.123 40.0255L109.316 45.049C111.149 46.8221 111.149 49.6786 109.316 51.3532L60.5409 98.6338C58.708 100.407 55.755 100.407 53.9221 98.6338L30.2983 75.7816C28.5672 74.107 28.5672 71.2504 30.2983 69.4774L35.5933 64.4539C37.3243 62.6808 40.2773 62.6808 42.1102 64.4539L57.1806 79.0321Z"
								fill="#6CE27C"
							/>
						</g>
						<defs>
							<clipPath id="clip0_847_2214">
								<rect
									width="81.6906"
									height="61.2679"
									fill="white"
									transform="translate(29 38.6957)"
								/>
							</clipPath>
						</defs>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default TransactionConfirmedModal;
