import React, { useState } from "react";

interface FundWagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	amount: number;
	walletAddress?: string;
}

const FundWagerModal: React.FC<FundWagerModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	amount,
	walletAddress = "Ey8FUGyPV2NbBxYvhvtdcSalJvZJ9JxssZalVvhddcSHMF",
}) => {
	const [copied, setCopied] = useState(false);

	if (!isOpen) return null;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(walletAddress);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="fixed inset-0 bg-[#00000026] p-4 px-9 backdrop-blur-[2px] flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-md rounded-lg p-6">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-lg font-bold text-center w-full">
						FUND YOUR WAGER
					</h2>

					<ModalCloseButton onClose={onClose} />
				</div>

				<hr className="border-[#0000002E] mb-9" />

				<div className="mb-6">
					<p className="font-bold text-sm mb-0.5 tracking-[0.2px]">
						Wallet Address <span className="text-red-500">*</span>
					</p>
					<div className="flex border border-[#00000012] rounded-lg">
						<input
							type="text"
							className="w-full py-2 px-3 text-xs text-[#000000BF] tracking-[0.2px] outline-none font-normal"
							value={walletAddress}
							readOnly
						/>
						<button
							className="pr-2 cursor-pointer"
							onClick={copyToClipboard}
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.8 0H4.8C4.1382 0 3.6 0.5382 3.6 1.2V3.6H1.2C0.5382 3.6 0 4.1382 0 4.8V10.8C0 11.4618 0.5382 12 1.2 12H7.2C7.8618 12 8.4 11.4618 8.4 10.8V8.4H10.8C11.4618 8.4 12 7.8618 12 7.2V1.2C12 0.5382 11.4618 0 10.8 0ZM1.2 10.8V4.8H7.2L7.2012 10.8H1.2ZM10.8 7.2H8.4V4.8C8.4 4.1382 7.8618 3.6 7.2 3.6H4.8V1.2H10.8V7.2Z"
									fill="#DADADA"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div className="mb-8">
					<p className="font-bold text-sm mb-0.5 tracking-[0.2px]">
						Amount <span className="text-red-500">*</span>
					</p>
					<div className="border border-[#00000012] rounded-lg">
						<input
							type="text"
							className="w-full px-3 py-2 text-xs text-[#000000BF] tracking-[0.2px] outline-none font-normal"
							value={`$${amount}`}
							readOnly
						/>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						Insufficient wallet balance
					</p>
					<p className="text-xs text-right text-green-600 mt-1">
						Fund from external wallet
					</p>
				</div>

				<div className="flex justify-center">
					<button
						className="bg-[#0A6B41] font-bold text-white px-6 py-1.5 rounded-xl mx-auto tracking-[0.5px] hover:bg-[#0A6B41] transition-colors"
						onClick={onConfirm}
					>
						Confirm Transaction
					</button>
				</div>
			</div>
		</div>
	);
};

export default FundWagerModal;

export const ModalCloseButton = ({ onClose }: { onClose: () => void }) => {
	return (
		<button
			onClick={onClose}
			className="ml-2 size-6 rounded-full cursor-pointer bg-[#2C2D2F24] text-black flex items-center justify-center -translate-y-2"
		>
			<svg
				width="9"
				height="9"
				viewBox="0 0 8 8"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M6.3095 0.511254C6.63487 0.185879 7.16276 0.186001 7.48821 0.511254C7.81364 0.836691 7.81364 1.36453 7.48821 1.68997L5.17766 3.99954L7.48821 6.31008C7.8135 6.63549 7.8135 7.16241 7.48821 7.48782C7.16277 7.81325 6.63493 7.81325 6.3095 7.48782L3.99993 5.17825L1.69036 7.48782C1.36492 7.81325 0.837082 7.81325 0.511645 7.48782C0.186452 7.16242 0.186448 6.63547 0.511645 6.31008L2.82122 3.99954L0.511645 1.68997C0.18623 1.36453 0.186215 0.836684 0.511645 0.511254C0.837084 0.185935 1.36495 0.185875 1.69036 0.511254L3.99993 2.82082L6.3095 0.511254Z"
					fill="black"
				/>
			</svg>
		</button>
	);
};
