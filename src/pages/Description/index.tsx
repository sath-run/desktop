import styles from './index.module.less';
import classNames from "classnames";
import {Modal} from "antd";
import React from "react";

const Description:React.FC<{visible: boolean, onCancel: () => any}> = ({visible, onCancel}) => {
    return (<Modal open={visible} centered width={620} footer={null} onCancel={onCancel}>
            <div className={styles.content}>
                <h2 className={classNames(styles.title)}>实验室简介</h2>
                <div className={styles.desc}>
                    之江实验室成立于2017年9月6日，坐落于杭州城西科创大走廊核心地带，是浙江省委、省政府深入实施创新驱动发展战略、探索新型举国体制浙江路径的重大科技创新平台。
                    实验室以“打造国家战略科技力量”为目标，由浙江省人民政府主导举办，实行“一体两核多点”的运行架构，主攻智能感知、人工智能、智能网络、智能计算和智能系统五大科研方向，
                    重点开展前沿基础研究、关键技术攻关和核心系统研发，建设大型科技基础设施和重大科研平台，抢占支撑未来智慧社会发展的智能计算战略高点。
                    目前，之江实验室已获批牵头建设智能科学与技术浙江省实验室。
                </div>
                <h2 className={classNames(styles.title, styles.titleMargin)}>项目简介</h2>
                <div className={styles.desc}>
                    现代药物发现严重依赖湿实验，导致药物发现具有典型的风险高、投资大以及周期长的特点，本项目旨在构建数字细胞，在硅基机器上模拟细胞多尺度的生命活动，从而有效缓解湿实验所面临的安全性、可重复性以及伦理挑战。具体而言，
                    本项目将结合基于数据驱动的人工智能算法与物理机制驱动的仿真模拟算法， 开展分子成药性评估、分子与蛋白对接、蛋白与蛋白交互等相关研究，并整合所研发的关键技术，搭建药物发现智能平台。
                </div>
                <h2 className={classNames(styles.title, styles.titleMargin)}>支持的算法</h2>
                <div className={styles.desc}>
                    <h3>1、VirtualFlow</h3>
                    VirtualFlow是由哈佛大学医学院牵头研发的全新开源药物发现平台，旨在利用高性能计算能力并行筛选潜在的有机化合物结构，以寻找有希望的新药物分子。
                    该平台支持AutoDock Vina、QuickVina 2、Smina、AutoDockFR、QuickVina-W、VinaXB和Vina-Carb等应用，能够利用AWS、GCP等主流公有云的计算能力进行大规模并行计算。
                </div>
            </div>
      </Modal>
    )
}

export default Description
