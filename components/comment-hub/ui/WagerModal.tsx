import React, { useState } from "react";
import { ModalCloseButton } from "./FundWagerModal";

interface WagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onProceed: (condition: string, stake: number) => void;
	username?: string;
	insufficientBalance?: boolean;
}

const WagerModal: React.FC<WagerModalProps> = ({
	isOpen,
	onClose,
	onProceed,
	username = "",
	insufficientBalance = false,
}) => {
	const [wagerCondition, setWagerCondition] = useState("");
	const [stakeAmount, setStakeAmount] = useState("");
	const [forUsername, setForUsername] = useState(username);
	const [againstUsername, setAgainstUsername] = useState("");

	if (!isOpen) return null;

	const handleProceed = () => {
		if (wagerCondition && stakeAmount) {
			onProceed(wagerCondition, parseFloat(stakeAmount));
		}
	};

	return (
		<div
			onClick={(e) => {
				onClose();
				e.stopPropagation();
			}}
			className="fixed inset-0 bg-[#00000026] flex items-center justify-center !z-[999999999999] p-4 px-9 backdrop-blur-[2px]"
		>
			<div
				onClick={(e) => {
					e.stopPropagation();
				}}
				className="bg-white w-full max-w-md rounded-lg p-6"
			>
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-lg font-bold text-center flex-1">
						{insufficientBalance ? "WAGER💰" : "WAGER"}
					</h2>
					<ModalCloseButton onClose={onClose} />
				</div>

				<hr className="text-[#0000002E] mb-3" />

				<div className="grid grid-cols-2 gap-4 mb-6">
					<div>
						<p className="font-bold text-xs tracking-[0.2px] mb-1">
							FOR
						</p>
						<div className="border border-[#0000000F] rounded-md px-2 py-1 bg-[#D9D9D900] w-32">
							<input
								type="text"
								className="w-full text-xs font-normal text-[#00000078] outline-none"
								placeholder="@Username"
								value={forUsername ? `@${forUsername}` : ""}
								onChange={(e) =>
									setForUsername(
										e.target.value.replace("@", "")
									)
								}
							/>
						</div>
					</div>
					<div>
						<p className="font-bold text-xs tracking-[0.2px] mb-1">
							AGAINST
						</p>
						<div className="border border-[#0000000F] rounded-md px-2 py-1 bg-[#D9D9D900] w-32">
							<input
								type="text"
								className="w-full text-xs font-normal text-[#00000078] outline-none"
								placeholder="@Username"
								value={
									againstUsername ? `@${againstUsername}` : ""
								}
								onChange={(e) =>
									setAgainstUsername(
										e.target.value.replace("@", "")
									)
								}
							/>
						</div>
					</div>
				</div>

				<div className="mb-6">
					<p className="font-bold text-xs tracking-[0.2px] mb-1">
						WAGER CONDITION <span className="text-red-500">*</span>
					</p>
					<div className="border border-[#0000000F] rounded-md px-2 py-1 bg-[#D9D9D900]">
						<input
							type="text"
							className="w-full text-xs font-normal text-[#00000078] outline-none"
							placeholder="Barcelona to win and Yamal to score"
							value={wagerCondition}
							onChange={(e) => setWagerCondition(e.target.value)}
						/>
					</div>
				</div>
				{/* className="mb-6" */}
				<div className="flex justify-between">
					<div>
						<div>
							<p className="font-bold text-xs tracking-[0.2px] mb-1">
								STAKE <span className="text-red-500">*</span>
							</p>
							<div className="border border-[#0000000F] rounded-md px-2 py-1 bg-[#D9D9D900] w-32">
								<input
									type="text"
									className="w-full text-xs font-normal text-[#00000078] outline-none"
									placeholder="$10"
									value={stakeAmount}
									onChange={(e) => {
										const val = e.target.value.replace(
											/[^0-9.]/g,
											""
										);
										setStakeAmount(val);
									}}
								/>
							</div>
						</div>

						{insufficientBalance && (
							<p className="mb-2 text-[10px] text-black tracking-[0.2px] text-center mt-0.5">
								Insufficient wallet balance
							</p>
						)}
					</div>

					<div className="flex flex-col translate-y-2">
						<button
							className="bg-green-700 text-white px-6 py-2 rounded-xl"
							onClick={handleProceed}
							disabled={!wagerCondition || !stakeAmount}
						>
							Book
						</button>
						{insufficientBalance && (
							<p className="text-[10px] underline text-[#0A6B41] tracking-[0.2px] text-center mt-0.5">
								Funds from external wallet
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WagerModal;
