﻿/**
 * 一个数值范围
*/
class NumericRange implements DoubleRange {

	// #region Properties (2)

	/**
     * 这个数值范围的最大值
    */
    public max: number;
	/**
     * 这个数值范围的最小值
    */
    public min: number;

	// #endregion

	// #region Constructors (1)

	public constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

	// #endregion

	// #region Public Accessors (1)

	public get Length(): number {
        return this.max - this.min;
    }

	// #endregion

	// #region Public Static Methods (1)

	/**
     * 从一个数值序列之中创建改数值序列的值范围
    */
    public static Create(numbers: number[]): NumericRange {
        var seq = From(numbers);
        var min: number = seq.Min();
        var max: number = seq.Max();

        return new NumericRange(min, max);
    }

	// #endregion

	// #region Public Methods (3)

	/**
     * 判断目标数值是否在当前的这个数值范围之内
    */
    public IsInside(x: number): boolean {
        return x >= this.min && x <= this.max;
    }

	public PopulateNumbers(step: number = (this.Length / 10)): number[] {
        var data: number[] = [];

        for (var x: number = this.min; x < this.max; x += step) {
            data.push(x);
        }

        return data;
    }

	public toString(): string {
        return `[${this.min}, ${this.max}]`;
    }

	// #endregion
}